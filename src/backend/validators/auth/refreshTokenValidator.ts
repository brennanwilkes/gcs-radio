import { body } from "express-validator";
import validationErrorHandler from "../../errorHandlers/validationErrorHandler";

export default [
	body("refresh_token").exists().isString().escape(),
	validationErrorHandler
];
