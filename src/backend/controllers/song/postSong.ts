import { Request, Response } from "express";
import { SongModelFromSong } from "../../../database/models/song";
import { SongApiObj, SongFromSearch, SongObjFromQuery } from "../../../types/song";
import { print } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { searchYoutubeDetailed } from "../../youtube/searchYoutube";
import { getSpotifyTrack } from "../../spotify/searchSpotify";
import { PlayAudioLink, SelfLink } from "../../../types/link";
import { cacheSongFromResults } from "../../util/cacheSong";

export default (req: Request, res: Response): void => {
	const errorHandler = internalErrorHandler(req, res);

	const youtubeId = String(req.query.youtubeId);
	const spotifyId = String(req.query.spotifyId);

	print(`Handling request for audio cache ${youtubeId} - ${spotifyId}`);

	searchYoutubeDetailed(youtubeId).then(youtubeInfo => {
		print(`Retrieved youtube information for "${youtubeInfo.title}"`);

		getSpotifyTrack(spotifyId).then(spotifyInfo => {
			print(`Retrieved spotify information for "${spotifyInfo.title}"`);

			cacheSongFromResults(youtubeInfo, spotifyInfo).then(audioId => {
				const newSong = new SongFromSearch(youtubeInfo, spotifyInfo, audioId);
				SongModelFromSong(newSong).save().then((resp) => {
					print(`Created song resource ${resp}`);
					res.send({
						songs: [
							new SongApiObj(new SongObjFromQuery(resp), [
								new PlayAudioLink(req, newSong),
								new SelfLink(req, resp._id, "songs")
							])
						]
					});
					res.end();
				}).catch(errorHandler);
			});
		}).catch(errorHandler);
	}).catch(errorHandler);
};
