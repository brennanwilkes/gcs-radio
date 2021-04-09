import { Request, Response } from "express";
import User from "../../../database/models/user";
import { UserFromDoc } from "../../../types/user";
import notFoundErrorHandler from "../../errorHandlers/notFoundErrorHandler";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { getUserFromToken } from "../../auth/getUser";
import logger from "../../logging/logger";

// Get user credentials
// Mostly just used to check if a token is valid from the frontend
// as it will return 401 or 404 if invalid, while 200 if valid
export default (req: Request, res: Response): void => {
	getUserFromToken(req.header("token") as string).then(user => {
		User.findById(user.id).then(userDoc => {
			if (userDoc) {
				const userObj = new UserFromDoc(userDoc);
				if (userObj.refreshToken) {
					// Ensure srt cookie is set
					// This is required by the frontend in order to
					// play music with the spotify web api
					res.cookie("srt", userObj.refreshToken, { httpOnly: false });
				}
				logger.logSuccessfulAuth();
				res.status(200).json({
					users: [userObj]
				});
			} else {
				notFoundErrorHandler(req, res)("user", user.id);
			}
		}).catch(() => notFoundErrorHandler(req, res)("user", user.id));
	}).catch(internalErrorHandler(req, res));
};
