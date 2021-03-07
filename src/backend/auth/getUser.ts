import { UserFromDoc, UserWithId, UserWithPassword } from "../../types/user";
import UserModel from "../../database/models/user";
import { resolveSignedPayload } from "./signPayload";

export function getUserIdFromToken (token: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		resolveSignedPayload(token).then(payload => {
			if ("user" in (payload as any) && "id" in (payload as any).user) {
				resolve((payload as any).user.id);
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
		getUserIdFromToken(token).then(id => {
			getUserFromId(id).then(user => {
				getPasswordFromId(id).then(password => {
					resolve({
						...user,
						password
					});
				}).catch(reject);
			}).catch(reject);
		}).catch(reject);
	});
}
