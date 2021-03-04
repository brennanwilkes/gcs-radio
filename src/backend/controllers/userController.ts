import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../../database/models/user";
import { UserFromDoc } from "../../types/user";
import notFoundErrorHandler from "../util/notFoundErrorHandler";
import internalErrorHandler from "../util/internalErrorHandler";
import invalidLoginErrorHandler from "../util/invalidLoginErrorHandler";
import conflictErrorHandler from "../util/conflictErrorHandler";

const tokenResponse = (req: Request, res: Response) => (err: Error | null, token: string | undefined) => {
	if (err || !token) {
		internalErrorHandler(req, res)(err?.message ?? "Internal Error");
	} else {
		res.status(200).json({
			token
		});
	}
};

const signIdResponse = (req: Request, res: Response, id: string) => {
	if (process.env.TOKEN_SECRET) {
		jwt.sign(
			{ user: { id: id } },
			process.env.TOKEN_SECRET,
			{ expiresIn: 3600 },
			tokenResponse(req, res)
		);
	} else {
		internalErrorHandler(req, res)("Token secret not set");
	}
};

export async function login (req: Request, res: Response) {
	const { email, password } = req.body;
	User.findOne({ email }).then(user => {
		if (user) {
			bcrypt.compare(password, user.password).then(match => {
				if (match) {
					signIdResponse(req, res, user.id);
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
	User.findOne({ email }).then(user => {
		if (user) {
			conflictErrorHandler(req, res)(`User ${email} already exists`);
		} else {
			bcrypt.genSalt(10).then(salt => {
				bcrypt.hash(password, salt).then(encryptedPassword => {
					new User({ email, encryptedPassword }).save().then(doc => {
						signIdResponse(req, res, doc.id);
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
