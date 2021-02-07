import { param } from "express-validator";
import { validationErrorHandler, mongoIdRegex } from "./validatorUtil";

export default [
	param("id")
		.exists()
		.trim()
		.matches(mongoIdRegex)
		.withMessage("song ID is not valid"),
	validationErrorHandler
];
