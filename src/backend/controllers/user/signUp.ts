import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../../../database/models/user";
import { UserType } from "../../../types/user";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import conflictErrorHandler from "../../errorHandlers/conflictErrorHandler";
import generateToken from "../../auth/generateToken";
import welcomeEmail from "../../email/welcomeEmail";
import { fireAndForgetMail } from "../../email/email";
import logger from "../../logging/logger";

export default async (req: Request, res: Response): Promise<void> => {
	const { email, password } = req.body;

	User.findOne({
		email,
		type: "PASSWORD"
	}).then(user => {
		if (user) {
			conflictErrorHandler(req, res)(`User ${email} already exists`);
		} else {
			bcrypt.genSalt(10).then(salt => {
				return bcrypt.hash(password, salt);
			}).then(encryptedPassword => {
				return new User({
					email,
					password: encryptedPassword,
					type: UserType.PASSWORD,
					verifiedEmail: false
				}).save();
			}).then(doc => {
				return generateToken(doc._id, 86400);
			}).then(token => {
				logger.logSignup(email, UserType.PASSWORD);
				fireAndForgetMail(welcomeEmail(email, token));
				res.status(200).json({});
			}).catch(internalErrorHandler(req, res));
		}
	}).catch(internalErrorHandler(req, res));
};
