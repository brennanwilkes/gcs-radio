import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../../../database/models/user";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import invalidLoginErrorHandler from "../../errorHandlers/invalidLoginErrorHandler";
import generateToken from "../../auth/generateToken";

// Login with password
export default async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;
	User.findOne({
		email,
		type: "PASSWORD",
		verifiedEmail: true
	}).then(user => {
		if (user && user.password) {
			bcrypt.compare(password, user.password).then(match => {
				if (match) {
					generateToken(user.id).then(token => {
						if (user.refreshToken) {
							res.cookie("srt", user.refreshToken, { httpOnly: false });
						}
						res.cookie("jwt", token, { httpOnly: false });
						res.status(200).json({ token });
					}).catch(internalErrorHandler(req, res));
				} else {
					invalidLoginErrorHandler(req, res)(email, 401);
				}
			}).catch(internalErrorHandler(req, res));
		} else {
			invalidLoginErrorHandler(req, res)(email, 404);
		}
	}).catch(() => invalidLoginErrorHandler(req, res)(email, 404));
};
