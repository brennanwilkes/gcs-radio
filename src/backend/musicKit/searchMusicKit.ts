import axios from "axios";
import { MusicKitResult, MusicKitResultFromApi } from "../../types/musicKitResult";
import generateDeveloperToken from "./generateDeveloperToken";

const endpoint = (country = "ca") => `https://api.music.apple.com/v1/catalog/${country}/search`;

export const determinedSearchMusicKit = (query: string, limit = 10): Promise<MusicKitResult[]> => {
	return new Promise<MusicKitResult[]>((resolve, reject) => {
		generateDeveloperToken().then(async token => {
			let results: MusicKitResult[] | void;
			do {
				results = await performSearch(query, limit, token).catch(() => {
					query = query.replace(/ [^ ]*$/g, "");
				});
			}
			while (query.match(/ /g) && !results);
			if (results) {
				resolve(results);
			} else {
				reject(results);
			}
		}).catch(reject);
	});
};

export default (query: string, limit = 2): Promise<MusicKitResult[]> => {
	return new Promise<MusicKitResult[]>((resolve, reject) => {
		generateDeveloperToken().then(token => {
			return performSearch(query, limit, token);
		}).then(resolve).catch(reject);
	});
};

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
