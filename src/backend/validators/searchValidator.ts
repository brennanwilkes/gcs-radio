import { oneOf, query } from "express-validator";
import { validationErrorHandler, spotifyIdRegex } from "./validatorUtil";

export default [
	oneOf([
		query("query").exists().trim().isString(),
		query("playlistId").exists().trim().isString().matches(spotifyIdRegex)
	]),
	validationErrorHandler
];
