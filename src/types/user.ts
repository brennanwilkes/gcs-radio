import { UserDoc } from "../database/models/user";
import { GoogleCredential } from "./googleCredential";
import SpotifyApi from "spotify-web-api-node";

/* eslint-disable no-unused-vars */
export enum UserType{
	PASSWORD = "PASSWORD",
	GOOGLE = "GOOGLE",
	SPOTIFY = "SPOTIFY"
}

/* eslint-enable no-unused-vars */

export interface User{
	email: string,
	createdAt: Date,
	type: UserType,
	id?: string
}

export interface UserWithId extends User{
	id: string
}

export interface UserWithPassword extends UserWithId{
	password: string
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

export class UserFromDoc implements UserWithId {
	email: string;
	createdAt: Date;
	type: UserType;
	id: string;
	constructor (doc: UserDoc) {
		this.id = doc.id;
		this.email = doc.email;
		this.type = doc.type as UserType;
		this.createdAt = doc.createdAt;
	}
}

export class UserFromGoogleCredentials extends UserObj {
	constructor (credentials: GoogleCredential) {
		super(credentials.email, UserType.GOOGLE);
	}
}

export class UserFromSpotifyCredentials extends UserObj {
	constructor (credentials: SpotifyApi.UserObjectPrivate) {
		super(credentials.email, UserType.SPOTIFY);
	}
}
