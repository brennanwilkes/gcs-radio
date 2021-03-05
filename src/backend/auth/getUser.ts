import { User, UserFromDoc } from "../../types/user";
import jwt, { VerifyCallback } from "jsonwebtoken";
import UserModel from "../../database/models/user";

const verificationCallback: ((resolve: (value: string | PromiseLike<string>) => void, reject: (err?: Error) => void) => VerifyCallback) = (resolve, reject) => (err, decoded) => {
	if (err || !decoded) {
		reject(new Error(err?.message ?? "Internal Error"));
	} else {
		if ("user" in decoded && "id" in (decoded as any).user) {
			resolve((decoded as any).user.id);
		} else {
			reject(new Error("Authorization error"));
		}
	}
};

export function getUserIdFromToken (token: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		if (process.env.TOKEN_SECRET) {
			jwt.verify(token, process.env.TOKEN_SECRET, verificationCallback(resolve, reject));
		} else {
			reject(new Error("Token secret not set"));
		}
	});
}

export function getUserFromId (id: string): Promise<User> {
	return new Promise<User>((resolve, reject) => {
		UserModel.findById(id).then(user => {
			if (user) {
				resolve(new UserFromDoc(user));
			} else {
				reject(new Error("User not found"));
			}
		}).catch(reject);
	});
}

export function getUserFromToken (token: string): Promise<User> {
	return new Promise<User>((resolve, reject) => {
		getUserIdFromToken(token)
			.then(getUserFromId)
			.then(resolve)
			.catch(reject);
	});
}
