import { Request, Response } from "express";
import { PlaylistDoc, PlaylistObjFromQuery } from "../../../database/models/playlist";
import { Song, SongApi, SongApiObj } from "../../../types/song";
import { PlayAudioLink, SelfLink, PatchLink } from "../../../types/link";
import { PlaylistApiObj } from "../../../types/playlist";

const applySongHATEOAS = (req: Request, song: Song): SongApi => new SongApiObj(song, [
	new PlayAudioLink(req, song),
	new SelfLink(req, song.id ?? "UNKNOWN", "songs")
]);

export default (playlistResults: PlaylistDoc[], req: Request, res:Response, userId?: string): void => {
	const playlists = playlistResults.map(result => {
		// Render out into playlist object
		const playlist = PlaylistObjFromQuery(result);

		// Apply song HATEOAS links
		if (playlist.details) {
			playlist.details.features = playlist.details.features.map(song => applySongHATEOAS(req, song));
		}
		playlist.songs = playlist.songs.map(song => applySongHATEOAS(req, song));

		// Apply playlist HATEOAS links
		const links = [new SelfLink(req, result._id, "playlists")];
		if (userId && playlist.details?.user === userId) {
			links.push(new PatchLink(req, result._id, "playlists"));
		}

		return new PlaylistApiObj(
			playlist,
			links
		);
	});

	res.send({
		playlists
	});
	res.end();
};
