import { Request, Response } from "express";
import { print } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import searchSpotify, { getSpotify } from "../../spotify/searchSpotify";
import { SongApiObj } from "../../../types/song";
import { DownloadLink } from "../../../types/link";
import resolveSpotifySongs from "../../util/resolveSongs";

export const search = (req: Request, res: Response): void => {
	if (req.query.query) {
		query(req, res);
	} else if (req.query.spotifyId) {
		loadResource(req, res);
	}
};

export const query = (req: Request, res: Response): void => {
	print(`Handling request for query search "${req.query.query}"`);

	searchSpotify(String(req.query.query)).then(spotifyResults => {
		return resolveSpotifySongs(spotifyResults.slice(0, 5));
	}).then(songs => {
		res.send({
			songs: songs.map(song => new SongApiObj(song, [new DownloadLink(req, song)]))
		});
	}).catch(internalErrorHandler(req, res));
};

export const loadResource = (req: Request, res: Response): void => {
	print(`Handling request for spotify resource "${req.query.spotifyId}"`);

	getSpotify(String(req.query.spotifyId)).then(spotifyResults => {
		return resolveSpotifySongs(spotifyResults);
	}).then(songs => {
		res.send({
			songs: songs.map(song => new SongApiObj(song, [new DownloadLink(req, song)]))
		});
	}).catch(internalErrorHandler(req, res));
};
