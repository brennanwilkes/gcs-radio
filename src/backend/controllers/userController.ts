import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../../database/models/user";
import { UserFromDoc, UserType } from "../../types/user";
import notFoundErrorHandler from "../errorHandlers/notFoundErrorHandler";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import invalidLoginErrorHandler from "../errorHandlers/invalidLoginErrorHandler";
import conflictErrorHandler from "../errorHandlers/conflictErrorHandler";
import generateToken from "../auth/generateToken";
import { getUserFromToken } from "../auth/getUser";
import welcomeEmail from "../email/welcomeEmail";
import { fireAndForgetMail } from "../email/email";
import logger from "../logging/logger";

export async function login (req: Request, res: Response): Promise<void> {
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
}

export async function signUp (req: Request, res: Response): Promise<void> {
	const { email, password } = req.body;

	let id: string | undefined;
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
				id = String(doc._id);
				return generateToken(doc._id);
			}).then(_token => {
				logger.logSignup(email, UserType.PASSWORD);
				fireAndForgetMail(welcomeEmail(email, id ?? "ERROR"));

				// res.cookie("jwt", token);
				res.status(200).json({});
			}).catch(internalErrorHandler(req, res));
		}
	}).catch(internalErrorHandler(req, res));
}

export function getUser (req: Request, res: Response): void {
	getUserFromToken(req.header("token") as string).then(user => {
		User.findById(user.id).then(userDoc => {
			if (userDoc) {
				const userObj = new UserFromDoc(userDoc);
				if (userObj.refreshToken) {
					res.cookie("srt", userObj.refreshToken, { httpOnly: false });
				}
				res.status(200).json({
					users: [userObj]
				});
			} else {
				notFoundErrorHandler(req, res)("user", user.id);
			}
		}).catch(() => notFoundErrorHandler(req, res)("user", user.id));
	}).catch(internalErrorHandler(req, res));
}

export function verifyEmail (req: Request, res: Response): void {
	const id = String(req.params.id);
	User.findById(id).then(userDoc => {
		if (userDoc) {
			userDoc.verifiedEmail = true;
			userDoc.save().then(() => {
				res.redirect("../login?verified=1");
			}).catch(internalErrorHandler(req, res));
		} else {
			notFoundErrorHandler(req, res)("user", id);
		}
	}).catch(() => notFoundErrorHandler(req, res)("user", id));
}
