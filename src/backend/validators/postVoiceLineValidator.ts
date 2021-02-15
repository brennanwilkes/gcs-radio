import { Request, Response, NextFunction } from "express";
import { query } from "express-validator";
import { validationErrorHandler, mongoIdValidator } from "./validatorUtil";
import Song from "../../database/models/song";
import { mongoose } from "../../database/connection";
import notFoundErrorHandler from "../util/notFoundErrorHandler";

export default [
	mongoIdValidator(query("prevId")),
	mongoIdValidator(query("nextId")),
	validationErrorHandler,
	(req: Request, res: Response, next: NextFunction): void => {
		const errorHandler = notFoundErrorHandler(req, res);
		Song.exists({ _id: new mongoose.Types.ObjectId(String(req.query.prevId)) }).then(res => {
			if (res) {
				Song.exists({ _id: new mongoose.Types.ObjectId(String(req.query.nextId)) }).then(res2 => {
					if (res2) {
						next();
					} else {
						errorHandler("song", String(req.query.nextId));
					}
				}).catch(() => errorHandler("song", String(req.query.nextId)));
			} else {
				errorHandler("song", String(req.query.prevId));
			}
		}).catch(() => errorHandler("song", String(req.query.prevId)));
	}
];
