import { Song, SongFromSearch } from "../../types/song";
import { SpotifyResult } from "../../types/spotifyResult";
import resultMatches from "./resultMatches";
import { print } from "./util";
import { searchYoutubeDetailed, searchYoutubeSimple } from "../youtube/searchYoutube";

export default function (spotifyResults: SpotifyResult[], searchAttempts = 10): Promise<Song[]> {
	return new Promise<Song[]>((resolve, reject) => {
		const songResults: Promise<(Song | void)>[] = spotifyResults.map(async spotifySong => {
			print(`Querying youtube for ${spotifySong.title} by ${spotifySong.artist}`);
			const youtubeIds = await searchYoutubeSimple(`song ${spotifySong.title} by ${spotifySong.artist} official`, searchAttempts).catch(reject);
			if (youtubeIds) {
				for (let i = 0; i < youtubeIds.length; i++) {
					print(`Querying youtube for ${youtubeIds[i]} metadata`);
					const youtubeDetails = await searchYoutubeDetailed(youtubeIds[i]).catch(reject);

					if (youtubeDetails && youtubeDetails.formats.length > 0 && resultMatches(spotifySong, youtubeDetails)) {
						print(`Success finding match on try ${i + 1} for ${spotifySong.title}`);
						return new SongFromSearch(youtubeDetails, spotifySong);
					}
				}
				print(`Failure finding match for ${spotifySong.title}`);
			}
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
