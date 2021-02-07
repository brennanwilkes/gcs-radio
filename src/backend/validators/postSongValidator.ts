import { Request, Response, NextFunction } from "express";
import { query } from "express-validator";
import Song from "../../database/models/song";
import { validationErrorHandler, verifyUrlExistance, youtubeIdValidator } from "./validatorUtil";
import { print } from "../util/util";

export default [
	youtubeIdValidator(query("id")),
	query("id").custom(async id => {
		verifyUrlExistance(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${id}&format=json`).then(exists => {
			if (!exists) {
				return Promise.reject(new Error("source ID doesn't exist"));
			}
		}).catch(err => {
			return Promise.reject(err);
		});
	}).withMessage("source ID doesn't exist"),
	validationErrorHandler,
	async (req: Request, res: Response, next: NextFunction) => {
		Song.findOne({ youtubeId: String(req.query.id) }).then(result => {
			if (result) {
				res.redirect(303, `${req.baseUrl}/songs/${result._id.toString()}`);
			} else {
				next();
			}
		}).catch(err => {
			print(err);
			next();
		});
	}
];
