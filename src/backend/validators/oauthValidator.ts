import { CustomValidator, query } from "express-validator";
import { authErrorHandler } from "./validatorUtil";
import { Request, Response, NextFunction } from "express";
import { resolveSignedPayload } from "../auth/signPayload";
import { generateDashboardRedirect } from "../util/util";

const existingTokenRedirect = [
	(req: Request, res: Response, next: NextFunction): void => {
		if (req.cookies.jwt) {
			resolveSignedPayload(req.cookies.jwt).then(() => {
				res.redirect(generateDashboardRedirect(req));
			}).catch(() => next());
		} else {
			next();
		}
	}
];

const isValidToken: CustomValidator = (token: string | undefined): Promise<boolean> => {
	return new Promise<boolean>((resolve, reject) => {
		if (token) {
			resolveSignedPayload(token).then(() => {
				resolve(true);
			}).catch(() => {
				reject(new Error("Invalid token"));
			});
		} else {
			reject(new Error("Invalid token"));
		}
	});
};

const isValidId: ((id: string) => CustomValidator) = (id: string) => (token: string | undefined): Promise<boolean> => {
	return new Promise<boolean>((resolve, reject) => {
		if (token) {
			resolveSignedPayload(token).then(payload => {
				if (payload === id || ("id" in (payload as any) && (payload as any)?.id === id)) {
					resolve(true);
				} else {
					reject(new Error("Invalid id"));
				}
			}).catch(() => {
				reject(new Error("Invalid token"));
			});
		} else {
			reject(new Error("Invalid token"));
		}
	});
};

const oauthValidator = [
	query("error").not().exists(),
	query("code").exists(),
	authErrorHandler
];

export { oauthValidator, existingTokenRedirect, isValidToken, isValidId };
