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
		.isArray()
		.withMessage("Playlist must have songs"),
	body("songs.*")
		.exists()
		.trim()
		.matches(mongoIdRegex)
		.withMessage("internal song ID is not valid"),
	oneOf([
		[
			body("user").not().exists().withMessage("Playlist must specify a user id"),
			body("name").not().exists().withMessage("Playlist must specify a name"),
			body("description").not().exists().withMessage("Playlist must specify a description"),
			body("features").not().exists().withMessage("Playlist must specify track features")
		],
		[
			body("user").exists().isString().not().isEmpty().trim().escape().matches(mongoIdRegex).withMessage("User ID is not valid"),
			body("name").exists().isString().not().isEmpty().trim().escape().withMessage("Playlist name is not valid"),
			body("description").exists().isString().trim().escape().withMessage("Playlist description is not valid"),
			body("features").exists().isArray().isLength({ min: 1, max: 3 }).withMessage("Invalid features"),
			body("features.*").exists().trim().matches(mongoIdRegex).withMessage("internal ID is not valid")
		]
	]),
	validationErrorHandler,
	oneOf([
		body("user").not().exists(),
		cookie("jwt").custom(isValidId("user")),
		header("token").custom(isValidId("user"))
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
