import { Request, Response } from "express";
import Playlist, { PlaylistDoc, PlaylistObjFromQuery, findById as findPlaylistById } from "../../database/models/playlist";
import { SongApiObj } from "../../types/song";
import { print } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import notFoundErrorHandler from "../errorHandlers/notFoundErrorHandler";
import { mongoose } from "../../database/connection";
import { PlayAudioLink, SelfLink } from "../../types/link";
import { PlaylistApiObj } from "../../types/playlist";
import accessDeniedErrorHandler from "../errorHandlers/accessDeniedErrorHandler";
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
					user: new mongoose.Types.ObjectId(user)
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
	print(`Handling request for playlist resource ${req.params.id}`);

	findPlaylistById(req.params.id).then(playlistResults => {
		if (playlistResults) {
			if (playlistResults.private) {
				getUserIdFromToken(req.header("token") ?? "INVALID").then(user => {
					if (user === String(playlistResults.user)) {
						sendPlaylistResponse([playlistResults], req, res);
					} else {
						accessDeniedErrorHandler(req, res)(playlistResults._id);
					}
				}).catch(() => {
					accessDeniedErrorHandler(req, res)(playlistResults._id);
				});
			} else {
				sendPlaylistResponse([playlistResults], req, res);
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

const patchPlaylist = (req: Request, res: Response): void => {
	const id: string = req.params.id;
	const name: string | undefined = req.body.name;
	const songs: string[] | undefined = req.body.songs;
	const description: string | undefined = req.body.description;
	const features: string[] | undefined = req.body.features;
	const privacy: boolean | undefined = req.body.private;

	getUserIdFromToken(req.header("token") ?? "INVALID").then(userId => {
		findPlaylistById(id, userId).then(playlist => {
			if (playlist) {
				if (name) {
					playlist.name = name;
				}
				if (songs) {
					playlist.songs = songs.map(song => new mongoose.Types.ObjectId(song));
				}
				if (description) {
					playlist.description = description;
				}
				if (features) {
					playlist.features = features.map(song => new mongoose.Types.ObjectId(song));
				}
				if (privacy) {
					playlist.private = privacy;
				}
				playlist.save().then(results => {
					sendPlaylistResponse([results], req, res);
				}).catch(internalErrorHandler(req, res));
			} else {
				notFoundErrorHandler(req, res)("playlist", id);
			}
		}).catch(internalErrorHandler(req, res));
	}).catch(() => {
		accessDeniedErrorHandler(req, res)(id);
	});
};

const deletePlaylist = (req: Request, res: Response): void => {
	const id: string = req.params.id;

	getUserIdFromToken(req.header("token") ?? "INVALID").then(userId => {
		findPlaylistById(id, userId).then(playlist => {
			if (playlist) {
				playlist.delete().then(() => {
					res.status(200).json({});
				}).catch(internalErrorHandler(req, res));
			} else {
				notFoundErrorHandler(req, res)("playlist", id);
			}
		}).catch(internalErrorHandler(req, res));
	}).catch(() => {
		accessDeniedErrorHandler(req, res)(id);
	});
};

export { getPlaylists, getPlaylist, postPlaylist, patchPlaylist, deletePlaylist };
