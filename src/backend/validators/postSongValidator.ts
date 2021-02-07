import { Request, Response, NextFunction } from "express";
import { query } from "express-validator";
import Song from "../../database/models/song";
import { validationErrorHandler, verifyUrlExistance, youtubeIdRegex } from "./validatorUtil";

export default [
	query("id")
		.exists()
		.trim()
		.matches(youtubeIdRegex)
		.withMessage("source ID is not valid"),
	query("id").custom(async id => {
		const exists = await verifyUrlExistance(`https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${id}&format=json`);
		if (!exists) {
			return Promise.reject(new Error("source ID doesn't exist"));
		}
	}).withMessage("source ID doesn't exist"),
	validationErrorHandler,
	async (req: Request, res: Response, next: NextFunction) => {
		Song.findOne({ youtubeId: req.query.id }).then(result => {
			if (result) {
				res.redirect(303, `${req.baseUrl}/songs/${result._id.toString()}`);
			} else {
				next();
			}
		}).catch(err => {
			console.error(err);
			next();
		});
	}
];
