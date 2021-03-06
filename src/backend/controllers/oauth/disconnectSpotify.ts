import { Request, Response } from "express";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import UserModel from "../../../database/models/user";
import { getUserIdFromToken } from "../../auth/getUser";

// Controller for de-associating a spotify refresh token from an account
export default (req: Request, res:Response): void => {
	if (req.headers.token && typeof req.headers.token === "string") {
		getUserIdFromToken(req.headers.token).then(existingUserId => {
			return UserModel.findOne({
				_id: existingUserId
			});
		}).then(existingUser => {
			if (existingUser) {
				// Delete the user's refresh token
				existingUser.spotifyRefreshToken = undefined;
				existingUser.save().then(() => {
					res.status(200).end();
				}).catch(internalErrorHandler(req, res));
			} else {
				internalErrorHandler(req, res)("Invaid user ID");
			}
		}).catch(internalErrorHandler(req, res));
	} else {
		internalErrorHandler(req, res)("Invaid token");
	}
};
