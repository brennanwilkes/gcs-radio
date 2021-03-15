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
	refreshToken?: string,
	id?: string,
	password?: string
}

export interface UserWithId extends User{
	id: string
}

export interface UserWithPassword extends UserWithId{
	password: string
}

export interface UserOptions{
	email: string,
	type: UserType,
	createdAt?: Date,
	refreshToken?: string,
	id?: string
}

export class UserObj implements User {
	email: string;
	createdAt: Date;
	type: UserType;
	id?: string;
	refreshToken?: string;
	constructor (opts: UserOptions) {
		if (opts.id) {
			this.id = opts.id;
		}
		if (opts.refreshToken) {
			this.refreshToken = opts.refreshToken;
		}
		this.email = opts.email;
		this.type = opts.type;
		this.createdAt = opts.createdAt ?? new Date();
	}
}

export class UserFromDoc extends UserObj implements UserWithId {
	id: string;
	constructor (doc: UserDoc) {
		super({
			id: doc.id,
			email: doc.email,
			type: doc.type as UserType,
			createdAt: doc.createdAt,
			refreshToken: doc.refreshToken
		});
		this.id = doc.id;
	}
}

export class UserFromGoogleCredentials extends UserObj {
	constructor (credentials: GoogleCredential) {
		super({
			email: credentials.email,
			type: UserType.GOOGLE
		});
	}
}

export class UserFromSpotifyCredentials extends UserObj {
	constructor (credentials: SpotifyApi.UserObjectPrivate, refreshToken?: string) {
		super({
			email: credentials.email,
			type: UserType.SPOTIFY,
			refreshToken
		});
	}
}
