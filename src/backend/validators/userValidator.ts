import { body, header } from "express-validator";
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

const cookieToHeader = [
	(req: Request, _res: Response, next: NextFunction): void => {
		if (!req.header("token") && req.cookies.jwt) {
			req.headers.token = req.cookies.jwt;
		}
		next();
	}
];

const tokenValidator = [
	header("token").exists(),
	authErrorHandler,
	(req: Request, res: Response, next: NextFunction): void => {
		getUserFromToken(req.header("token") as string).then(() => {
			next();
		}).catch(internalErrorHandler(req, res));
	}
];

export { signUpValidator, loginValidator, tokenValidator, cookieToHeader };
