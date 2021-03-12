import { Request, Response } from "express";
import { print } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import searchSpotify, { getSpotify } from "../spotify/searchSpotify";
import { SongApiObj } from "../../types/song";
import { DownloadLink } from "../../types/link";
import resolveSpotifySongs from "../util/resolveSongs";

const search = (req: Request, res: Response): void => {
	if (req.query.query) {
		query(req, res);
	} else if (req.query.spotifyId) {
		loadResource(req, res);
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

/*
	https://open.spotify.com/playlist/2oSL2GUCioG5YYivCntakb?si=a5LJnxfkSIi7mE5keuLATg
	spotify:playlist:2oSL2GUCioG5YYivCntakb
	2oSL2GUCioG5YYivCntakb

	https://open.spotify.com/playlist/1s0IdWaELhzqWb3wrxfW7Q?si=aq8zZRXXR16sjPiyJQedVA
	spotify:playlist:1s0IdWaELhzqWb3wrxfW7Q
	1s0IdWaELhzqWb3wrxfW7Q

	https://open.spotify.com/track/1fDtoTPDyzkNOfFIRXxsC5?si=hoVKHnT_SyK94agIGZiauA
	spotify:track:1fDtoTPDyzkNOfFIRXxsC5
	1fDtoTPDyzkNOfFIRXxsC5
*/

const loadResource = (req: Request, res: Response): void => {
	const errorHandler = internalErrorHandler(req, res);

	print(`Handling request for spotify resource "${req.query.spotifyId}"`);

	getSpotify(String(req.query.spotifyId)).then(spotifyResults => {
		resolveSpotifySongs(spotifyResults).then(songs => {
			res.send({
				songs: songs.map(song => new SongApiObj(song, [new DownloadLink(req, song)]))
			});
		}).catch(errorHandler);
	}).catch(errorHandler);
};

export { search, query, loadResource };
