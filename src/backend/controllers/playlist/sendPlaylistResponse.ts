import { Request, Response } from "express";
import { PlaylistDoc, PlaylistObjFromQuery } from "../../../database/models/playlist";
import { SongApiObj } from "../../../types/song";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { PlayAudioLink, SelfLink, PatchLink } from "../../../types/link";
import { PlaylistApiObj } from "../../../types/playlist";

export default (playlistResults: PlaylistDoc[], req: Request, res:Response, userId?: string) => {
	const noRender = !!req.query.noRender;

	const playlists = playlistResults.map(async result => {
		const playlist = await PlaylistObjFromQuery(result, !noRender);

		playlist.songs = playlist.songs.map(song => new SongApiObj(song, [
			new PlayAudioLink(req, song),
			new SelfLink(req, song.id ?? "UNKNOWN", "songs")
		]));

		const links = [new SelfLink(req, result._id, "playlists")];
		if (userId && playlist.details?.user === userId) {
			links.push(new PatchLink(req, result._id, "playlists"));
		}

		return new PlaylistApiObj(
			playlist,
			links
		);
	});

	Promise.all(playlists).then(playlistResolved => {
		res.send({
			playlists: playlistResolved
		});
		res.end();
	}).catch(internalErrorHandler(req, res));
};
