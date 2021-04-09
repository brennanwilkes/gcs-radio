import { Request, Response } from "express";
import Song from "../../../database/models/song";
import { SongApiObj, SongObjFromQuery } from "../../../types/song";
import { print } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import notFoundErrorHandler from "../../errorHandlers/notFoundErrorHandler";
import { mongoose } from "../../../database/connection";
import { PlayAudioLink, SelfLink } from "../../../types/link";
import { ensureSongValidity } from "../../util/cacheSong";

export default (req: Request, res: Response): void => {
	print(`Handling request for song resource ${req.params.id}`);

	Song.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) }).then(async result => {
		if (result) {
			// Ensure song has a valid audioID
			// This is so heavy audio resource caches can be periodically cleared out
			const validResult = await ensureSongValidity(result);
			const song = new SongObjFromQuery(validResult);

			res.send({

				// Apply HATEOAS links
				songs: [
					new SongApiObj(song, [
						new PlayAudioLink(req, song),
						new SelfLink(req, result._id, "songs")
					])
				]
			});
			res.end();
		} else {
			notFoundErrorHandler(req, res)("song", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};
