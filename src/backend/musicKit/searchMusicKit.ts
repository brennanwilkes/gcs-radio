import axios from "axios";
import { MusicKitResult, MusicKitResultFromApi } from "../../types/musicKitResult";
import { Song } from "../../types/song";
import { titleSanitizer } from "../util/util";
import generateDeveloperToken from "./generateDeveloperToken";

const endpoint = (country = "ca") => `https://api.music.apple.com/v1/catalog/${country}/search`;

export const determinedSearchMusicKitBySong = (song: Song, limit = 10): Promise<MusicKitResult[]> => {
	const artist = titleSanitizer(song.artist);
	const title = titleSanitizer(song.title);
	return searchMusicKit(`${title} ${artist}`, limit);
};

export const determinedSearchMusicKit = (query: string, limit = 10): Promise<MusicKitResult[]> => {
	let queries: string[] = [];
	do {
		queries = [...queries, query];
		query = query.replace(/ [^ ]*$/g, "");
	}
	while (query.match(/ /g));

	const data: (MusicKitResult[] | number | undefined)[] = queries.map(() => undefined);
	let hasResolved = false;

	return new Promise<MusicKitResult[]>((resolve, reject) => {
		generateDeveloperToken().then(async token => {
			queries.forEach((query, i) => {
				performSearch(query, limit, token).then(results => {
					if (!hasResolved) {
						data[i] = results;
						let wait = false;
						for (let j = 0; j < results.length; j++) {
							if (hasResolved) {
								break;
							}
							if (data[j] === undefined) {
								wait = true;
								break;
							}
							if (data[j] !== -1 && data[j] !== undefined) {
								hasResolved = true;
								resolve(data[j] as MusicKitResult[]);
								break;
							}
						}
						if (!hasResolved && !wait) {
							reject(new Error("Failed to find results"));
						}
					}
				}).catch(() => {
					data[i] = -1;
				});
			});
		}).catch(reject);
	});
};

const searchMusicKit = (query: string, limit = 10): Promise<MusicKitResult[]> => {
	return new Promise<MusicKitResult[]>((resolve, reject) => {
		generateDeveloperToken().then(token => {
			return performSearch(query, limit, token);
		}).then(resolve).catch(reject);
	});
};
export default searchMusicKit;

const performSearch = (query: string, limit: number, token: string):Promise<MusicKitResult[]> => {
	return new Promise<MusicKitResult[]>((resolve, reject) => {
		axios.get(`${endpoint()}?term=${query.replace(/ +/g, "+")}&limit=${limit}&types=songs`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(resp => {
			if (resp.data.results?.songs?.data && resp.data.results.songs.data.length > 0) {
				/* eslint-disable @typescript-eslint/no-explicit-any */
				resolve(resp.data.results.songs.data.map((result: any) => new MusicKitResultFromApi(result)));
				/* eslint-enable @typescript-eslint/no-explicit-any */
			} else if (resp.data.errors && resp.data.errors.length > 0 && resp.data.errors[0].detail) {
				reject(new Error(resp.data.errors[0].detail));
			} else {
				reject(new Error("Failed to search Apple Music"));
			}
		}).catch(reject);
	});
};
