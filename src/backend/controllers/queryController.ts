import { Request, Response } from "express";
import { print } from "../util/util";
import internalErrorHandler from "../util/internalErrorHandler";
import searchSpotify from "../spotify/searchSpotify";
import { searchYoutubeSimple, searchYoutubeDetailed } from "../youtube/searchYoutube";
import { Song, SongApiObj, SongFromSearch } from "../../types/song";
import { DownloadLink } from "../../types/link";
import resultMatches from "../util/resultMatches";

const query = (req: Request, res: Response): void => {
	const errorHandler = internalErrorHandler(req, res);

	print(`Handling request for query search "${req.query.query}"`);
	searchSpotify(String(req.query.query)).then(spotifyResults => {
		const songResults: Promise<(Song | void)>[] = spotifyResults.slice(0, 5).map(async (spotifySong, songNumber) => {
			print(`Querying youtube for ${spotifySong.title} by ${spotifySong.artist}`);
			const youtubeIds = await searchYoutubeSimple(`${spotifySong.title} by ${spotifySong.artist} on ${spotifySong.album} official audio song`, 6 - songNumber);

			for (let i = 0; i < youtubeIds.length; i++) {
				print(`Querying youtube for ${youtubeIds[i]} metadata`);
				const youtubeDetails = await searchYoutubeDetailed(youtubeIds[i]).catch(errorHandler);

				if (youtubeDetails && resultMatches(spotifySong, youtubeDetails)) {
					print(`Success finding match on try ${i + 1} for ${spotifySong.title}`);
					return new SongFromSearch(youtubeDetails, spotifySong);
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

			res.send({
				songs: filtered.map(song => new SongApiObj(song, [new DownloadLink(req, song)]))
			});
		}).catch(errorHandler);
	}).catch(errorHandler);
};

export { query };
