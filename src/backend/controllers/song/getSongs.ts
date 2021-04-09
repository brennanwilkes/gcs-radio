import { Request, Response } from "express";
import Song from "../../../database/models/song";
import { SongApiObj, SongObjFromQuery } from "../../../types/song";
import { CONFIG, print } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import notFoundErrorHandler from "../../errorHandlers/notFoundErrorHandler";
import { PlayAudioLink, SelfLink } from "../../../types/link";
import { ensureSongValidity } from "../../util/cacheSong";

export default (req: Request, res: Response): void => {
	const limit = (req.query.limit as number | undefined) ?? CONFIG.defaultApiLimit;

	print(`Handling request for song resources`);

	Song.find({}).limit(limit).then(result => {
		if (result) {
			const songProcessing = result.map(async result => {
				// Ensure song has a valid audioID
				// This is so heavy audio resource caches can be periodically cleared out
				const validResult = await ensureSongValidity(result);
				const song = new SongObjFromQuery(validResult);

				// Apply HATEOAS links
				return new SongApiObj(song, [
					new PlayAudioLink(req, song),
					new SelfLink(req, result._id, "songs")
				]);
			});
			Promise.all(songProcessing).then(songs => {
				res.send({
					songs: songs
				});
				res.end();
			}).catch(internalErrorHandler(req, res));
		} else {
			notFoundErrorHandler(req, res)("song", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};
