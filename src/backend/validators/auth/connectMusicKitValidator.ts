import { query } from "express-validator";
import validationErrorHandler from "../../errorHandlers/validationErrorHandler";

export default [
	query("musicKitToken")
		.exists()
		.trim()
		.not().isEmpty()
		.isString()
		.withMessage("Invalid Music Kit Token"),
	validationErrorHandler
];
