import { UserDoc } from "../database/models/user";

export interface User{
	email: string,
	createdAt: Date,
	id?: string
}

export class UserObj implements User {
	email: string;
	createdAt: Date;
	id?: string;
	constructor (email: string, createdAt: Date, id?: string) {
		if (id) {
			this.id = id;
		}
		this.email = email;
		this.createdAt = createdAt;
	}
}

export class UserFromDoc extends UserObj {
	constructor (doc: UserDoc) {
		super(doc.email, doc.createdAt, String(doc._id));
	}
}
