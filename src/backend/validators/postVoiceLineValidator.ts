import { Request, Response, NextFunction } from "express";
import { oneOf, query } from "express-validator";
import { mongoIdRegex, mongoIdValidator } from "./validatorUtil";
import Song from "../../database/models/song";
import Playlist from "../../database/models/playlist";
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

const playlistExists = (id: string): Promise<boolean> => {
	return new Promise<boolean>((resolve, reject) => {
		Playlist.exists({ _id: new mongoose.Types.ObjectId(id) }).then(res => {
			if (res) {
				resolve(true);
			} else {
				reject(new Error("Playlist doesn't exist"));
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
	query("playlist").optional().escape().trim().matches(mongoIdRegex),

	query("gender").optional().escape().trim().default(VoiceGender.DEFAULT).isIn(Object.values(VoiceGender)).withMessage("Invalid Voice Gender"),
	query("voice").optional().escape().trim().default(Voice.DEFAULT).isIn(Object.values(Voice)).withMessage("Invalid Voice"),

	validationErrorHandler,
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const errorHandler = notFoundErrorHandler(req, res);

		let valid: boolean | void = !req.query.playlist;
		if (req.query.playlist) {
			valid = await playlistExists(String(req.query.playlist)).catch(() => errorHandler("playlist", String(req.query.playlist)));
		}
		if (valid) {
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
	}
];
