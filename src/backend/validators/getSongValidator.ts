import { param } from "express-validator";
import { validationErrorHandler, mongoIdValidator } from "./validatorUtil";

export default [
	mongoIdValidator(param("id")),
	validationErrorHandler
];
