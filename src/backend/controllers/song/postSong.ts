import { Request, Response } from "express";
import { SongModelFromSong } from "../../../database/models/song";
import { Song, SongApiObj, SongObjFromQuery } from "../../../types/song";
import { CONFIG } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { getSpotifyTrack } from "../../spotify/searchSpotify";
import { PlayAudioLink, SelfLink } from "../../../types/link";
import { cacheSongFromSong } from "../../util/cacheSong";
import resolveSongs from "../../util/resolveSongs";

export default (req: Request, res: Response): void => {
	const spotifyId = String(req.query.spotifyId);

	let songCache: Song | undefined;
	getSpotifyTrack(spotifyId).then(spotifyInfo => {
		return resolveSongs([spotifyInfo]);
	}).then((songs: Song[]) => {
		if (songs.length === 0) {
			return Promise.reject(new Error("Failed to resolve songs"));
		}
		songCache = songs[0];
		if (CONFIG.matchWithYoutube) {
			return cacheSongFromSong(songCache);
		} else {
			return Promise.resolve(CONFIG.defaultAudioId);
		}
	}).then(audioId => {
		(songCache as Song).audioId = audioId;
		return SongModelFromSong(songCache as Song).save();
	}).then(resp => {
		res.send({
			songs: [
				new SongApiObj(new SongObjFromQuery(resp), [
					new PlayAudioLink(req, songCache as Song),
					new SelfLink(req, resp._id, "songs")
				])
			]
		}).end();
	}).catch(internalErrorHandler(req, res));
};
