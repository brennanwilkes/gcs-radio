import { param } from "express-validator";
import { mongoIdValidator } from "../validatorUtil";
import validationErrorHandler from "../../errorHandlers/validationErrorHandler";

export default [
	mongoIdValidator(param("id")),
	validationErrorHandler
];
