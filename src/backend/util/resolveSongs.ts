import { Song, SongFromSearch } from "../../types/song";
import { SpotifyResult } from "../../types/spotifyResult";
import resultMatches from "./resultMatches";
import { print } from "./util";
import { searchYoutubeDetailed, searchYoutubeSimple } from "../youtube/searchYoutube";

export default function (spotifyResults: SpotifyResult[], searchAttempts = 24): Promise<Song[]> {
	let limiter = Math.floor(searchAttempts / 6);

	return new Promise<Song[]>((resolve, reject) => {
		const songResults: Promise<(Song | void)>[] = spotifyResults.map(async (spotifySong, _songNumber) => {
			print(`Querying youtube for ${spotifySong.title} by ${spotifySong.artist}`);
			const youtubeIds = await searchYoutubeSimple(`song ${spotifySong.title} by ${spotifySong.artist} official`, searchAttempts);

			for (let i = 0; i < youtubeIds.length && limiter > 0; i++) {
				print(`Querying youtube for ${youtubeIds[i]} metadata`);
				const youtubeDetails = await searchYoutubeDetailed(youtubeIds[i]).catch(reject);

				if (youtubeDetails && youtubeDetails.formats.length < 1) {
					print(`No youtube formats found for ${youtubeDetails.youtubeTitle} (${spotifySong.title})`);
					limiter++;
				}

				if (youtubeDetails && youtubeDetails.formats.length > 0 && resultMatches(spotifySong, youtubeDetails)) {
					print(`Success finding match on try ${i + 1} for ${spotifySong.title}`);
					return new SongFromSearch(youtubeDetails, spotifySong);
				} else {
					limiter--;
				}
			}
			print(`Failure finding match for ${spotifySong.title}`);
		});

		Promise.all(songResults).then(results => {
			const filtered: Song[] = [];
			results.forEach(res => {
				if (res) {
					filtered.push(res);
				}
			});

			resolve(filtered);
		}).catch(reject);
	});
}
