import { CustomValidator, Meta, query } from "express-validator";
import { authErrorHandler } from "./validatorUtil";
import { Request, Response, NextFunction } from "express";
import { resolveSignedPayload } from "../auth/signPayload";
import { generateDashboardRedirect } from "../util/util";

const existingTokenRedirect = [
	(req: Request, res: Response, next: NextFunction): void => {
		const token = req.headers.token ?? req.cookies.jwt;
		if (token) {
			resolveSignedPayload(token).then(() => {
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

const isValidId: ((bodyParam: string) => CustomValidator) = (bodyParam: string) =>
	(token: string | undefined, meta: Meta): Promise<boolean> => {
		return new Promise<boolean>((resolve, reject) => {
			const id = meta.req.body[bodyParam];
			if (token) {
				resolveSignedPayload(token).then(payload => {
					if (payload === id) {
						resolve(true);
					} else if (
						"user" in (payload as any) &&
						"id" in ((payload as any).user as any) &&
						(payload as any).user.id === id
					) {
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
