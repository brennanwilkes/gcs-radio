import { Request, Response } from "express";
import Playlist, { PlaylistDoc, PlaylistObjFromQuery } from "../../database/models/playlist";
import { SongApiObj } from "../../types/song";
import { print } from "../util/util";
import internalErrorHandler from "../util/internalErrorHandler";
import notFoundErrorHandler from "../util/notFoundErrorHandler";
import { mongoose } from "../../database/connection";
import { PlayAudioLink, SelfLink } from "../../types/link";
import { PlaylistApiObj } from "../../types/playlist";
import accessDeniedErrorHandler from "../util/accessDeniedErrorHandler";
import { getUserIdFromToken } from "../auth/getUser";

const sendPlaylistResponse = (playlistResults: PlaylistDoc[], req: Request, res:Response) => {
	const playlists = playlistResults.map(async result => {
		const playlist = await PlaylistObjFromQuery(result);

		playlist.songs = playlist.songs.map(song => new SongApiObj(song, [
			new PlayAudioLink(req, song),
			new SelfLink(req, song.id ?? "UNKNOWN", "songs")
		]));

		return new PlaylistApiObj(
			playlist,
			[new SelfLink(req, result._id, "playlists")]
		);
	});

	Promise.all(playlists).then(playlistResolved => {
		res.send({
			playlists: playlistResolved
		});
		res.end();
	}).catch(internalErrorHandler(req, res));
};

const getPlaylists = (req: Request, res: Response): void => {
	print(`Handling request for playlist resources`);

	let total: PlaylistDoc[] = [];
	Playlist.find({
		private: false
	}).then(playlistResults => {
		total = [...playlistResults];
		return new Promise<PlaylistDoc[]>((resolve, reject) => {
			getUserIdFromToken(req.header("token") ?? "INVALID").then(user => {
				Playlist.find({
					user: new mongoose.Schema.Types.ObjectId(user)
				}).then(resolve).catch(reject);
			}).catch(() => {
				resolve(Promise.resolve([]));
			});
		});
	}).then(playlistResults => {
		total = [...total, ...playlistResults];
		if (total && total.length) {
			sendPlaylistResponse(total, req, res);
		} else {
			notFoundErrorHandler(req, res)("playlist");
		}
	}).catch(internalErrorHandler(req, res));
};

const getPlaylist = (req: Request, res: Response): void => {
	const user = "TEMP";

	print(`Handling request for playlist resource ${req.params.id}`);

	Playlist.findOne({
		_id: new mongoose.Types.ObjectId(req.params.id)
	}).then(playlistResults => {
		if (playlistResults) {
			if (!playlistResults.private || String(playlistResults.user) === user) {
				sendPlaylistResponse([playlistResults], req, res);
			} else {
				accessDeniedErrorHandler(req, res)(playlistResults._id);
			}
		} else {
			notFoundErrorHandler(req, res)("playlist", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};

const postPlaylist = (req: Request, res: Response): void => {
	print(`Handling request for playlist creation`);

	const songIds: string[] = req.body.songs;

	new Playlist({
		songs: songIds,
		name: req.body.name,
		user: req.body.user ? new mongoose.Types.ObjectId(req.body.user) : undefined,
		description: req.body.description,
		features: req.body.features,
		private: req.body.private ?? true
	}).save().then(resp => {
		print(`Created playlist resource ${resp}`);
		sendPlaylistResponse([resp], req, res);
	}).catch(internalErrorHandler(req, res));
};

export { getPlaylists, getPlaylist, postPlaylist };
