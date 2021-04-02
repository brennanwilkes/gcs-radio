import { Response, Request, NextFunction } from "express";
import { getUserFromToken } from "../../auth/getUser";
import accessDeniedErrorHandler from "../../errorHandlers/accessDeniedErrorHandler";
import validationErrorHandler from "../../errorHandlers/validationErrorHandler";
import { limitValidator } from "../validatorUtil";

export default [
	limitValidator(30),
	validationErrorHandler,
	(req: Request, res: Response, next: NextFunction): void => {
		getUserFromToken(req.header("token") as string).then(user => {
			if (user.refreshToken) {
				next();
			} else {
				accessDeniedErrorHandler(req, res)("Spotify Playlists");
			}
		}).catch(() => accessDeniedErrorHandler(req, res)("Spotify Playlists"));
	}
];
