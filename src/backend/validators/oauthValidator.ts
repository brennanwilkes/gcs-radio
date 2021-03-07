import { query } from "express-validator";
import { authErrorHandler } from "./validatorUtil";
import { Request, Response, NextFunction } from "express";
import { resolveSignedPayload } from "../auth/signPayload";
import { generateDashboardRedirect } from "../util/util";

const existingTokenRedirect = [
	(req: Request, res: Response, next: NextFunction): void => {
		if (req.cookies.jwt) {
			resolveSignedPayload(req.cookies.jwt).then(() => {
				res.redirect(generateDashboardRedirect(req));
			}).catch(next);
		} else {
			next();
		}
	}
];

const oauthValidator = [
	query("error").not().exists(),
	query("code").exists(),
	authErrorHandler
];

export { oauthValidator, existingTokenRedirect };
