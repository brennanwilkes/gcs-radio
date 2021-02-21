import { oneOf, query } from "express-validator";
import { validationErrorHandler, spotifyWebRegex, spotifyURIRegex, spotifyIdRegex } from "./validatorUtil";

export default [
	oneOf([
		query("query").exists().trim().isString(),
		query("spotifyId")
			.exists()
			.trim()
			.isString()
			.matches(spotifyIdRegex),
		query("spotifyId")
			.exists()
			.trim()
			.isString()
			.matches(spotifyWebRegex)
			.customSanitizer(complex => complex.replace(spotifyWebRegex, (_str: string, id: string): string => id)),
		query("spotifyId")
			.exists()
			.trim()
			.isString()
			.matches(spotifyURIRegex)
			.customSanitizer(complex => complex.replace(spotifyURIRegex, (_str: string, id: string): string => id))
	]),
	validationErrorHandler
];
