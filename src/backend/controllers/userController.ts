import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../../database/models/user";
import { UserFromDoc } from "../../types/user";
import notFoundErrorHandler from "../util/notFoundErrorHandler";
import internalErrorHandler from "../util/internalErrorHandler";
import invalidLoginErrorHandler from "../util/invalidLoginErrorHandler";
import conflictErrorHandler from "../util/conflictErrorHandler";
import generateToken from "../auth/generateToken";

export async function login (req: Request, res: Response) {
	const { email, password } = req.body;
	User.findOne({
		email,
		type: "PASSWORD"
	}).then(user => {
		if (user && user.password) {
			bcrypt.compare(password, user.password).then(match => {
				if (match) {
					generateToken(user.id).then(token => {
						res.status(200).json({
							token
						});
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

export async function signUp (req: Request, res: Response) {
	const { email, password } = req.body;
	User.findOne({
		email,
		type: "PASSWORD"
	}).then(user => {
		if (user) {
			conflictErrorHandler(req, res)(`User ${email} already exists`);
		} else {
			bcrypt.genSalt(10).then(salt => {
				bcrypt.hash(password, salt).then(encryptedPassword => {
					new User({
						email,
						password: encryptedPassword,
						type: "PASSWORD"
					}).save().then(doc => {
						generateToken(doc._id).then(token => {
							res.status(200).json({
								token
							});
						}).catch(internalErrorHandler(req, res));
					}).catch(internalErrorHandler(req, res));
				}).catch(internalErrorHandler(req, res));
			}).catch(internalErrorHandler(req, res));
		}
	}).catch(internalErrorHandler(req, res));
}

export function getUser (req: Request, res: Response) {
	User.findById(req.body.user.id).then(user => {
		if (user) {
			res.status(200).json({
				users: [new UserFromDoc(user)]
			});
		} else {
			notFoundErrorHandler(req, res)("user", req.body.user.id);
		}
	}).catch(() => notFoundErrorHandler(req, res)("user", req.body.user.id));
}
