import { body, oneOf, cookie, header } from "express-validator";
import { mongoIdRegex } from "../validatorUtil";
import { isValidId } from "../auth/oauthValidator";
import validationErrorHandler from "../../errorHandlers/validationErrorHandler";
import authorizationErrorHandler from "../../errorHandlers/authorizationErrorHandler";

export default [
	body("songs")
		.exists()
		.isArray()
		.withMessage("Playlist must have songs"),
	body("songs.*")
		.exists()
		.trim()
		.matches(mongoIdRegex)
		.withMessage("Internal song ID is not valid"),
	oneOf([
		[
			body("user").exists().isString().not().isEmpty().trim().escape().matches(mongoIdRegex).withMessage("User ID is not valid"),
			body("name").exists().isString().not().isEmpty().trim().escape().withMessage("Playlist name is not valid"),
			body("description").optional().isString().trim().escape().withMessage("Playlist description is not valid").default("GCS Radio playlist"),
			body("features").exists().isArray().custom((value: string[]) => {
				if (value.length <= 3 && value.length > 0) {
					return true;
				}
				throw new Error("Song features must contain 1-3 song IDS");
			}).withMessage("Invalid features"),
			body("features.*").exists().trim().matches(mongoIdRegex).withMessage("Internal ID is not valid")
		],
		[
			body("user").not().exists().withMessage("Playlist must specify both a user ID and name or neither"),
			body("name").not().exists().withMessage("Playlist must specify both a user ID and name or neither")
		]
	]),
	body("private").optional().isBoolean().withMessage("Playlist privacy is not valid").default(true),
	validationErrorHandler,
	oneOf([
		body("user").not().exists(),
		cookie("jwt").custom(isValidId("user")),
		header("token").custom(isValidId("user"))
	]),
	authorizationErrorHandler
];
