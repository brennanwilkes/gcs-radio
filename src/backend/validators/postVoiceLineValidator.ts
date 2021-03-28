import { Request, Response, NextFunction } from "express";
import { oneOf, query } from "express-validator";
import { mongoIdValidator } from "./validatorUtil";
import Song from "../../database/models/song";
import { mongoose } from "../../database/connection";
import notFoundErrorHandler from "../errorHandlers/notFoundErrorHandler";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import { Voice, VoiceGender } from "../../types/voiceLine";

const songExists = (id: string): Promise<void> => {
	return new Promise<void>((resolve, reject) => {
		Song.exists({ _id: new mongoose.Types.ObjectId(id) }).then(res => {
			if (res) {
				resolve();
			} else {
				reject(new Error("Song doesn't exist"));
			}
		}).catch(reject);
	});
};

const voiceLineErrorMessage = "A first song, or both previous and next song ID is required for voicelines";

export default [
	oneOf([
		mongoIdValidator(query("prevId")),
		mongoIdValidator(query("firstId"))
	], voiceLineErrorMessage),
	oneOf([
		mongoIdValidator(query("nextId")),
		mongoIdValidator(query("firstId"))
	], voiceLineErrorMessage),

	query("gender").optional().escape().trim().default(VoiceGender.DEFAULT).isIn(Object.values(VoiceGender)).withMessage("Invalid Voice Gender"),
	query("voice").optional().escape().trim().default(Voice.DEFAULT).isIn(Object.values(Voice)).withMessage("Invalid Voice"),

	validationErrorHandler,
	(req: Request, res: Response, next: NextFunction): void => {
		const errorHandler = notFoundErrorHandler(req, res);

		if (req.query.firstId) {
			songExists(String(req.query.firstId)).then(() => {
				next();
			}).catch(() => errorHandler("song", String(req.query.firstId)));
		} else {
			songExists(String(req.query.prevId)).then(() => {
				songExists(String(req.query.nextId)).then(() => {
					next();
				}).catch(() => errorHandler("song", String(req.query.nextId)));
			}).catch(() => errorHandler("song", String(req.query.prevId)));
		}
	}
];
