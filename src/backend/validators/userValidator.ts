import { body, header } from "express-validator";
import { validationErrorHandler, authErrorHandler } from "./validatorUtil";
import { Request, Response, NextFunction } from "express";
import jwt, { VerifyCallback } from "jsonwebtoken";
import internalErrorHandler from "../util/internalErrorHandler";

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

const verificationCallback: ((req: Request, res: Response, next: NextFunction) => VerifyCallback) = (req: Request, res: Response, next: NextFunction) => (err, decoded) => {
	if (err || !decoded) {
		internalErrorHandler(req, res)(err?.message ?? "Internal Error");
	} else {
		if ("user" in decoded) {
			req.body.user = (decoded as any).user;
			next();
		} else {
			internalErrorHandler(req, res)("Authorization error");
		}
	}
};

const tokenValidator = [
	header("token").exists(),
	authErrorHandler,
	(req: Request, res: Response, next: NextFunction) => {
		const token = req.header("token") as string;
		if (process.env.TOKEN_SECRET) {
			jwt.verify(token, process.env.TOKEN_SECRET, verificationCallback(req, res, next));
		} else {
			internalErrorHandler(req, res)("Token secret not set");
		}
	}
];

export { signUpValidator, loginValidator, tokenValidator };
