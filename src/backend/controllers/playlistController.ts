import { Request, Response } from "express";
import Playlist, { PlaylistDoc, PlaylistObjFromQuery } from "../../database/models/playlist";
import { SongApiObj } from "../../types/song";
import { print } from "../util/util";
import internalErrorHandler from "../util/internalErrorHandler";
import notFoundErrorHandler from "../util/notFoundErrorHandler";
import { mongoose } from "../../database/connection";
import { PlayAudioLink, SelfLink } from "../../types/link";
import { PlaylistApiObj } from "../../types/playlist";

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

const getPlaylists = async (req: Request, res: Response): Promise<void> => {
	print(`Handling request for playlist resources`);

	await Playlist.find({}).then(async playlistResults => {
		if (playlistResults) {
			sendPlaylistResponse(playlistResults, req, res);
		} else {
			notFoundErrorHandler(req, res)("playlist", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};

const getPlaylist = async (req: Request, res: Response): Promise<void> => {
	print(`Handling request for playlist resource ${req.params.id}`);

	Playlist.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) }).then(async playlistResults => {
		if (playlistResults) {
			sendPlaylistResponse([playlistResults], req, res);
		} else {
			notFoundErrorHandler(req, res)("playlist", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};

const postPlaylist = (req: Request, res: Response): void => {
	print(`Handling request for playlist creation`);

	const songIds: string[] = req.body.songs;

	new Playlist({
		songs: songIds
	}).save().then(resp => {
		print(`Created playlist resource ${resp}`);
		sendPlaylistResponse([resp], req, res);
	}).catch(internalErrorHandler(req, res));
};

export { getPlaylists, getPlaylist, postPlaylist };
