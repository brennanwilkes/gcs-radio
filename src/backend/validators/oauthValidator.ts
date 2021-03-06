import { query } from "express-validator";
import { authErrorHandler } from "./validatorUtil";

const oauthValidator = [
	query("error").not().exists(),
	query("code").exists(),
	authErrorHandler
];

export { oauthValidator };
