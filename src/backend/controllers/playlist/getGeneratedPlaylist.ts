import { Request, Response } from "express";
import Playlist from "../../../database/models/playlist";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import getGeneratedPlaylist from "../../spotify/getGeneratedPlaylist";
import cacheSongsFromSpotify from "../../spotify/cacheSongsFromSpotify";

import sendPlaylistResponse from "./sendPlaylistResponse";

export default (req: Request, res: Response): void => {
	getGeneratedPlaylist(req).then(spotifyResults => {
		return cacheSongsFromSpotify(spotifyResults);
	}).then(songs => {
		const songIds = songs.map(song => String(song.id));
		return new Playlist({
			songs: songIds,
			private: false,
			autoGenerated: true
		}).save();
	}).then(docs => {
		sendPlaylistResponse([docs], req, res);
	}).catch(internalErrorHandler(req, res));
};
