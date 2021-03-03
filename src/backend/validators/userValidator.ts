import { body, header } from "express-validator";
import { validationErrorHandler, authErrorHandler } from "./validatorUtil";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
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

const tokenValidator = [
	header("token").exists(),
	authErrorHandler,
	(req: Request, res: Response, next: NextFunction) => {
		const token = req.header("token") as string;
		const decoded = jwt.verify(token, "randomString") as any;
		if ("user" in decoded) {
			req.body.user = decoded.user;
			next();
		} else {
			internalErrorHandler(req, res)("Authorization error");
		}
	}
];

export { signUpValidator, loginValidator, tokenValidator };
