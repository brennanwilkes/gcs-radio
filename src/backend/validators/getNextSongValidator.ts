import { query } from "express-validator";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import { limitValidator, mongoIdValidator } from "./validatorUtil";

export default [
	limitValidator(30),
	mongoIdValidator(query("playlist")),
	validationErrorHandler
];
