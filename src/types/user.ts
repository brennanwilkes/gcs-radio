import { UserDoc } from "../database/models/user";
import { GoogleCredential } from "./googleCredential";

/* eslint-disable no-unused-vars */
export enum UserType{
	PASSWORD = "PASSWORD",
	GOOGLE = "GOOGLE"
}

/* eslint-enable no-unused-vars */

export interface User{
	email: string,
	createdAt: Date,
	type: UserType,
	id?: string
}

export class UserObj implements User {
	email: string;
	createdAt: Date;
	type: UserType;
	id?: string;
	constructor (email: string, type: UserType, createdAt: Date = new Date(), id?: string) {
		if (id) {
			this.id = id;
		}
		this.email = email;
		this.type = type;
		this.createdAt = createdAt;
	}
}

export class UserFromDoc extends UserObj {
	constructor (doc: UserDoc) {
		super(doc.email, doc.type as UserType, doc.createdAt, String(doc._id));
	}
}

export class UserFromGoogleCredentials extends UserObj {
	constructor (credentials: GoogleCredential) {
		super(credentials.email, UserType.GOOGLE);
	}
}
