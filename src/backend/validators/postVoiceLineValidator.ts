import { Request, Response, NextFunction } from "express";
import { oneOf, query } from "express-validator";
import { validationErrorHandler, mongoIdValidator } from "./validatorUtil";
import Song from "../../database/models/song";
import { mongoose } from "../../database/connection";
import notFoundErrorHandler from "../util/notFoundErrorHandler";

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

export default [
	oneOf([
		mongoIdValidator(query("prevId")),
		mongoIdValidator(query("firstId"))
	]),
	oneOf([
		mongoIdValidator(query("nextId")),
		mongoIdValidator(query("firstId"))
	]),
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
