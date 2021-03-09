import { Request, Response, NextFunction } from "express";
import { body, oneOf, cookie, header } from "express-validator";
import Playlist from "../../database/models/playlist";
import { validationErrorHandler, mongoIdRegex, authErrorHandler } from "./validatorUtil";
import { print } from "../util/util";
import { mongoose } from "../../database/connection";
import { isValidId } from "./oauthValidator";

export default [
	body("songs")
		.exists()
		.isArray(),
	body("songs.*")
		.exists()
		.trim()
		.matches(mongoIdRegex)
		.withMessage("internal ID is not valid"),
	oneOf([
		[
			body("user").not().exists(),
			body("name").not().exists()],
		[
			body("user").exists().not().isEmpty().trim().escape().matches(mongoIdRegex).withMessage("User ID is not valid"),
			body("name").exists().not().isEmpty().trim().escape().withMessage("Playlist name is not valid")
		]
	]),
	validationErrorHandler,
	oneOf([
		body("user").not().exists(),
		cookie("jwt").custom(isValidId),
		header("token").custom(isValidId)
	]),
	authErrorHandler,
	(req: Request, res: Response, next: NextFunction): void => {
		Playlist.findOne({ songs: req.body.songs.map((id: string) => new mongoose.Types.ObjectId(id)) }).then(result => {
			if (result) {
				res.redirect(303, `${req.baseUrl}/playlists/${result._id.toString()}`);
			} else {
				next();
			}
		}).catch(err => {
			print(err);
			next();
		});
	}
];
