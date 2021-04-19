import { Request, Response } from "express";
import { SongModelFromSong } from "../../../database/models/song";
import { Song, SongApiObj, SongFromSpotify, SongObjFromQuery } from "../../../types/song";
import { CONFIG } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { getSpotifyTrack } from "../../spotify/searchSpotify";
import { PlayAudioLink, SelfLink } from "../../../types/link";
import { cacheSongFromSong } from "../../util/cacheSong";
import youtubePlayableConverter from "../../youtube/youtubePlayableConverter";

export default (req: Request, res: Response): void => {
	const youtubeId = String(req.query.youtubeId);
	const spotifyId = String(req.query.spotifyId);

	let songCache: Song | undefined;
	getSpotifyTrack(spotifyId).then(spotifyInfo => {
		const newSong = new SongFromSpotify(spotifyInfo);
		if (CONFIG.matchWithYoutube) {
			if (youtubeId) {
				return Promise.resolve(youtubePlayableConverter.directUpgradeToPlayable(newSong, youtubeId));
			} else {
				return youtubePlayableConverter.upgradeToPlayable(newSong);
			}
		}
		return Promise.resolve(newSong);
	}).then((song: Song) => {
		songCache = song;
		if (CONFIG.matchWithYoutube) {
			return cacheSongFromSong(song);
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
