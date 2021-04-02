import { CustomValidator, Meta, query } from "express-validator";
import authorizationErrorHandler from "../../errorHandlers/authorizationErrorHandler";
import { Request, Response, NextFunction } from "express";
import { resolveSignedPayload } from "../../auth/signPayload";
import { generateDashboardRedirect } from "../../util/util";

export const existingTokenRedirect = [
	(req: Request, res: Response, next: NextFunction): void => {
		const token = `${req.headers.token}`;
		resolveSignedPayload(token).then(() => {
			res.redirect(generateDashboardRedirect(req));
		}).catch(() => next());
	}
];

export const isValidToken: CustomValidator = (token: string | undefined): Promise<boolean> => {
	return new Promise<boolean>((resolve, reject) => {
		if (token) {
			resolveSignedPayload(token).then(() => {
				resolve(true);
			}).catch(() => {
				resolve(false);
			});
		} else {
			resolve(false);
		}
	});
};

export const isValidId: ((bodyParam: string) => CustomValidator) = (bodyParam: string) =>
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
						resolve(false);
					}
				}).catch(() => {
					resolve(false);
				});
			} else {
				resolve(false);
			}
		});
	};

export const oauthValidator = [
	query("error").not().exists(),
	query("code").exists(),
	authorizationErrorHandler
];
