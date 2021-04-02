import { Request, Response } from "express";
import { SongApiObj } from "../../../types/song";
import { CONFIG } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import notFoundErrorHandler from "../../errorHandlers/notFoundErrorHandler";
import { PlayAudioLink, SelfLink } from "../../../types/link";
import arrayshuffle from "array-shuffle";
import { findById as findPlaylistById, PlaylistDoc, PlaylistObjFromQuery } from "../../../database/models/playlist";
import { getUserIdFromToken } from "../../auth/getUser";
import accessDeniedErrorHandler from "../../errorHandlers/accessDeniedErrorHandler";
import getRecommendations from "../../spotify/getRecommendations";
import cacheSongsFromSpotify from "../../spotify/cacheSongsFromSpotify";

const sendNextSongResponse = (playlistResults: PlaylistDoc, req: Request, res:Response, limit: number) => {
	PlaylistObjFromQuery(playlistResults).then(playlist => {
		return getRecommendations({
			seed_tracks: arrayshuffle(playlist.songs).slice(0, 5).map(song => song.spotifyId),
			limit
		});
	}).then(recommendations => {
		return cacheSongsFromSpotify(recommendations);
	}).then(songs => {
		res.send({
			songs: songs.map(song => new SongApiObj(song, [
				new PlayAudioLink(req, song),
				new SelfLink(req, String(song.id), "songs")
			]))
		});
		res.end();
	}).catch(internalErrorHandler(req, res));
};

export default (req: Request, res: Response): void => {
	const limit = (req.query.limit as number | undefined) ?? CONFIG.defaultApiLimit;
	findPlaylistById(String(req.query.playlist)).then(playlistResults => {
		if (playlistResults) {
			getUserIdFromToken(req.header("token") ?? "INVALID").then(user => {
				if (!playlistResults.private || user === String(playlistResults.user)) {
					sendNextSongResponse(playlistResults, req, res, limit);
				} else {
					accessDeniedErrorHandler(req, res)(playlistResults._id);
				}
			}).catch(() => {
				if (playlistResults.private) {
					accessDeniedErrorHandler(req, res)(playlistResults._id);
				} else {
					sendNextSongResponse(playlistResults, req, res, limit);
				}
			});
		} else {
			notFoundErrorHandler(req, res)("playlist", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};
