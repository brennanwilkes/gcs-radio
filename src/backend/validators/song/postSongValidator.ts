import { Request, Response, NextFunction } from "express";
import { oneOf, query } from "express-validator";
import Song from "../../../database/models/song";
import { verifyUrlExistance, youtubeIdValidator, spotifyIdValidator } from "../validatorUtil";
import { CONFIG, print } from "../../util/util";
import validationErrorHandler from "../../errorHandlers/validationErrorHandler";
import { ensureSongValidity } from "../../util/cacheSong";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";

export default [
	oneOf([
		youtubeIdValidator(query("youtubeId")),
		query("youtubeId").not().exists()
	]),
	query("youtubeId").custom(async id => {
		if (CONFIG.defaultAudioId && !id) {
			return Promise.resolve(true);
		} else if (!id) {
			return Promise.reject(new Error("youtube ID Not set"));
		}
		return verifyUrlExistance(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${String(id)}&format=json`).then(exists => {
			if (exists) {
				return Promise.resolve(true);
			} else {
				return Promise.reject(new Error("Invalid youtube ID"));
			}
		}).catch(() => {
			return Promise.reject(new Error("Invalid youtube ID"));
		});
	}).withMessage("youtube ID doesn't exist"),
	spotifyIdValidator(query("spotifyId")),
	validationErrorHandler,
	(req: Request, res: Response, next: NextFunction): void => {
		const args = {
			youtubeId: req.query.youtubeId ? String(req.query.youtubeId) : { $exists: false },
			spotifyId: String(req.query.spotifyId)
		};

		Song.findOne(args).then(result => {
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
