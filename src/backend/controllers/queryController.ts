import { Request, Response } from "express";
import { print } from "../util/util";
import internalErrorHandler from "../util/internalErrorHandler";
import searchSpotify, { getSpotifyPlaylist } from "../spotify/searchSpotify";
import { SongApiObj } from "../../types/song";
import { DownloadLink } from "../../types/link";
import resolveSpotifySongs from "../spotify/resolveSpotifySongs";

const search = (req: Request, res: Response): void => {
	if (req.query.query) {
		query(req, res);
	} else if (req.query.playlistId) {
		loadPlaylist(req, res);
	}
};

const query = (req: Request, res: Response): void => {
	const errorHandler = internalErrorHandler(req, res);

	print(`Handling request for query search "${req.query.query}"`);

	searchSpotify(String(req.query.query)).then(spotifyResults => {
		resolveSpotifySongs(spotifyResults.slice(0, 5)).then(songs => {
			res.send({
				songs: songs.map(song => new SongApiObj(song, [new DownloadLink(req, song)]))
			});
		}).catch(errorHandler);
	}).catch(errorHandler);
};

const loadPlaylist = (req: Request, res: Response): void => {
	const errorHandler = internalErrorHandler(req, res);

	print(`Handling request for spotify playlist "${req.query.playlistId}"`);

	getSpotifyPlaylist(String(req.query.playlistId)).then(spotifyResults => {
		resolveSpotifySongs(spotifyResults).then(songs => {
			res.send({
				songs: songs.map(song => new SongApiObj(song, [new DownloadLink(req, song)]))
			});
		}).catch(errorHandler);
	}).catch(errorHandler);
};

export { search, query, loadPlaylist };
