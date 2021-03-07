import { body, header, oneOf, cookie } from "express-validator";
import { validationErrorHandler, authErrorHandler } from "./validatorUtil";
import { Request, Response, NextFunction } from "express";
import internalErrorHandler from "../util/internalErrorHandler";
import { getUserFromToken } from "../auth/getUser";

const loginValidator = [
	body("email").isEmail().withMessage("Please enter a valid email"),
	body("password").isLength({
		min: 6
	}).withMessage("Password must be atleast six characters long"),
	validationErrorHandler
];

const signUpValidator = [
	body("email").isEmail().withMessage("Please enter a valid email"),
	body("password").isLength({
		min: 6
	}).withMessage("Password must be atleast six characters long"),
	validationErrorHandler
];

const tokenValidator = [
	oneOf([
		header("token").exists(),
		cookie("jwt").exists()
	]),
	authErrorHandler,
	(req: Request, res: Response, next: NextFunction) => {
		const token = (req.header("token") ?? req.cookies.jwt) as string;
		getUserFromToken(token).then(() => {
			req.headers.token = token;
			next();
		}).catch(internalErrorHandler(req, res));
	}
];

export { signUpValidator, loginValidator, tokenValidator };
