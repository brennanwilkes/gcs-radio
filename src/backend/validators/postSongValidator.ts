import { Request, Response, NextFunction } from "express";
import { query } from "express-validator";
import Song from "../../database/models/song";
import { verifyUrlExistance, youtubeIdValidator, spotifyIdValidator } from "./validatorUtil";
import { print } from "../util/util";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import { ensureSongValidity } from "../util/cacheSong";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";

export default [
	youtubeIdValidator(query("youtubeId")),
	query("youtubeId").custom(async id => {
		verifyUrlExistance(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${id}&format=json`).then(exists => {
			if (!exists) {
				return Promise.reject(new Error("youtube ID doesn't exist"));
			}
		}).catch(err => {
			return Promise.reject(err);
		});
	}).withMessage("youtube ID doesn't exist"),
	spotifyIdValidator(query("spotifyId")),
	validationErrorHandler,
	(req: Request, res: Response, next: NextFunction): void => {
		Song.findOne({ youtubeId: String(req.query.youtubeId), spotifyId: String(req.query.spotifyId) }).then(result => {
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
