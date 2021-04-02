import { param } from "express-validator";
import validationErrorHandler from "../../errorHandlers/validationErrorHandler";
import { mongoIdValidator } from "../validatorUtil";

export default [
	mongoIdValidator(param("id")),
	validationErrorHandler
];
