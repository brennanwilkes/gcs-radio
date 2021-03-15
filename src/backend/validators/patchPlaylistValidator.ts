import { body, param } from "express-validator";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import { mongoIdRegex, mongoIdValidator } from "./validatorUtil";

export default [
	body("songs")
		.optional()
		.isArray(),
	body("songs.*")
		.trim()
		.optional()
		.matches(mongoIdRegex)
		.withMessage("internal song ID is not valid"),
	body("name").optional().isString().not().isEmpty().trim().escape().withMessage("Playlist name is not valid"),
	body("description").optional().isString().trim().escape().withMessage("Playlist description is not valid").default("GCS Radio playlist"),
	body("features").optional().isArray().custom((value: string[]) => {
		if (value.length <= 3 && value.length > 0) {
			return true;
		}
		throw new Error("Song features must contain 1-3 song IDS");
	}).withMessage("Invalid features"),
	body("features.*").optional().trim().matches(mongoIdRegex).withMessage("internal ID is not valid"),
	body("private").optional().isBoolean().withMessage("Playlist privacy is not valid"),
	mongoIdValidator(param("id")),
	validationErrorHandler
];
