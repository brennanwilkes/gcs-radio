import { Request, Response, NextFunction } from "express";
import { query } from "express-validator";
import Song from "../../database/models/song";
import { verifyUrlExistance, youtubeIdValidator, spotifyIdValidator, mongoVerifyBucketExistance } from "./validatorUtil";
import { print } from "../util/util";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import { SongObjFromQuery } from "../../types/song";
import { cacheSongFromSong } from "../util/cacheSong";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import { mongoose } from "../../database/connection";

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
				mongoVerifyBucketExistance(String(result.audioId)).then(exists => {
					if (exists) {
						res.redirect(303, `${req.baseUrl}/songs/${result._id.toString()}`);
					} else {
						cacheSongFromSong(new SongObjFromQuery(result)).then(audioId => {
							result.audioId = new mongoose.Schema.Types.ObjectId(audioId);
							return result.save();
						}).then(newDoc => {
							res.redirect(303, `${req.baseUrl}/songs/${newDoc._id.toString()}`);
						}).catch(internalErrorHandler(req, res));
					}
				}).catch(() => {
					cacheSongFromSong(new SongObjFromQuery(result)).then(audioId => {
						result.audioId = new mongoose.Schema.Types.ObjectId(audioId);
						return result.save();
					}).then(newDoc => {
						res.redirect(303, `${req.baseUrl}/songs/${newDoc._id.toString()}`);
					}).catch(internalErrorHandler(req, res));
				});
			} else {
				next();
			}
		}).catch(err => {
			print(err);
			next();
		});
	}
];
