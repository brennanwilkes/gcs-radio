import { body, header } from "express-validator";
import { Request, Response, NextFunction } from "express";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import { getUserFromToken } from "../auth/getUser";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import authorizationErrorHandler from "../errorHandlers/authorizationErrorHandler";

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
	body("password2").isLength({
		min: 6
	}).withMessage("Password must be atleast six characters long"),
	body("password").custom((password, meta) => {
		if (password !== meta.req.body.password2) {
			throw new Error("Passwords don't match");
		} else {
			return password;
		}
	}).withMessage("Passwords do not match"),

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
	authorizationErrorHandler,
	(req: Request, res: Response, next: NextFunction): void => {
		getUserFromToken(req.header("token") as string).then(() => {
			next();
		}).catch(internalErrorHandler(req, res));
	}
];

export { signUpValidator, loginValidator, tokenValidator, cookieToHeader };
