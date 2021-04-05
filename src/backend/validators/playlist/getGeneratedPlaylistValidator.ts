import { body } from "express-validator";
import validationErrorHandler from "../../errorHandlers/validationErrorHandler";
import { limitValidator, mongoIdRegex } from "../validatorUtil";

export default [
	limitValidator(30),
	body("songs")
		.exists()
		.isArray({ min: 1, max: 5 })
		.withMessage("Playlist must have 1-5 seed songs"),
	body("songs.*")
		.exists()
		.trim()
		.matches(mongoIdRegex)
		.withMessage("Internal song ID is not valid"),
	body("acousticness").optional().isFloat({ min: 0.0, max: 1.0 }).toFloat(),
	body("danceability").optional().isFloat({ min: 0.0, max: 1.0 }).toFloat(),
	body("energy").optional().isFloat({ min: 0.0, max: 1.0 }).toFloat(),
	body("instrumentalness").optional().isFloat({ min: 0.0, max: 1.0 }).toFloat(),
	body("key").optional().isInt({ min: 0, max: 11 }).toInt(),
	body("loudness").optional().isFloat({ min: -100.0, max: 100.0 }).toFloat(),
	body("mode").optional().isBoolean().toBoolean(),
	body("tempo").optional().isInt({ min: 0, max: 200 }).toInt(),
	body("valence").optional().isFloat({ min: 0.0, max: 1.0 }).toFloat(),
	validationErrorHandler
];
