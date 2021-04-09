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
	return new Promise<boolean>((resolve) => {
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

/* eslint-disable @typescript-eslint/no-explicit-any */
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
						reject(new Error("Payload does not match ID"));
					}
				}).catch(reject);
			} else {
				reject(new Error("Token does not exist"));
			}
		});
	};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const oauthValidator = [
	query("error").not().exists(),
	query("code").exists(),
	authorizationErrorHandler
];
