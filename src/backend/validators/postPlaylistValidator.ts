import { Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import Playlist from "../../database/models/playlist";
import { validationErrorHandler, mongoIdRegex } from "./validatorUtil";
import { print } from "../util/util";
import { mongoose } from "../../database/connection";

export default [
	body("songs")
		.exists()
		.isArray(),
	body("songs.*")
		.exists()
		.trim()
		.matches(mongoIdRegex)
		.withMessage("internal ID is not valid"),
	validationErrorHandler,
	(req: Request, res: Response, next: NextFunction): void => {
		Playlist.findOne({ songs: req.body.songs.map((id: string) => new mongoose.Types.ObjectId(id)) }).then(result => {
			if (result) {
				res.redirect(303, `${req.baseUrl}/playlists/${result._id.toString()}`);
			} else {
				next();
			}
		}).catch(err => {
			print(err);
			next();
		});
	}
];
