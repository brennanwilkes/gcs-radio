import { User, UserFromDoc, UserWithId, UserWithPassword } from "../../types/user";
import UserModel from "../../database/models/user";
import { resolveSignedPayload } from "./signPayload";

/* eslint-disable @typescript-eslint/no-explicit-any */
function isUser (unknown: any): unknown is {user:User} {
	return typeof unknown !== "string" && "user" in unknown && "id" in unknown.user;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function getUserIdFromToken (token: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		resolveSignedPayload(token).then(payload => {
			if (isUser(payload) && payload.user.id) {
				resolve(payload.user.id);
			} else {
				reject(new Error("Authorization error"));
			}
		}).catch(reject);
	});
}

export function getUserFromId (id: string): Promise<UserWithId> {
	return new Promise<UserWithId>((resolve, reject) => {
		UserModel.findById(id).then(user => {
			if (user) {
				resolve(new UserFromDoc(user));
			} else {
				reject(new Error("User not found"));
			}
		}).catch(reject);
	});
}

export function getPasswordFromId (id: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		UserModel.findById(id).then(user => {
			if (user && user.password) {
				resolve(user.password);
			} else {
				reject(new Error("Password not found"));
			}
		}).catch(reject);
	});
}

export function getUserFromToken (token: string): Promise<UserWithId> {
	return new Promise<UserWithId>((resolve, reject) => {
		getUserIdFromToken(token)
			.then(getUserFromId)
			.then(resolve)
			.catch(reject);
	});
}

export function getUserFromTokenWithPassword (token: string): Promise<UserWithPassword> {
	return new Promise<UserWithPassword>((resolve, reject) => {
		let idCache = "";
		let userCache: UserWithId | undefined;
		getUserIdFromToken(token).then(id => {
			idCache = id;
			return getUserFromId(id);
		}).then(user => {
			userCache = user;
			return getPasswordFromId(idCache);
		}).then(password => {
			resolve({
				...(userCache as UserWithId),
				password
			});
		}).catch(reject);
	});
}
