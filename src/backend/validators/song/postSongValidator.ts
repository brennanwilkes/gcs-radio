import { Request, Response, NextFunction } from "express";
import { query } from "express-validator";
import Song from "../../../database/models/song";
import { spotifyIdValidator } from "../validatorUtil";
import { print } from "../../util/util";
import validationErrorHandler from "../../errorHandlers/validationErrorHandler";
import { ensureSongValidity } from "../../util/cacheSong";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";

export default [
	spotifyIdValidator(query("spotifyId")),
	validationErrorHandler,
	(req: Request, res: Response, next: NextFunction): void => {
		Song.findOne({
			spotifyId: String(req.query.spotifyId)
		}).then(result => {
			if (result) {
				ensureSongValidity(result).then(newDoc => {
					res.redirect(303, `${req.baseUrl}/songs/${newDoc._id.toString()}`);
				}).catch(internalErrorHandler(req, res));
			} else {
				next();
			}
		}).catch(err => {
			print(err);
			next();
		});
	}
];
