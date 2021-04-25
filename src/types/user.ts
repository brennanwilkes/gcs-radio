import { UserDoc } from "../database/models/user";
import { GoogleCredential } from "./googleCredential";
import SpotifyApi from "spotify-web-api-node";

/* eslint-disable no-unused-vars */
export enum UserType{
	PASSWORD = "PASSWORD",
	GOOGLE = "GOOGLE",
	SPOTIFY = "SPOTIFY",
	APPLE = "APPLE"
}
/* eslint-enable no-unused-vars */

export interface User{
	email: string,
	createdAt: Date,
	type: UserType,
	spotifyRefreshToken?: string,
	musicKitToken?: string,
	id?: string,
	password?: string,
	verifiedEmail?: boolean
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
	spotifyRefreshToken?: string,
	musicKitToken?: string,
	id?: string,
	verifiedEmail?: boolean
}

export class UserObj implements User {
	email: string;
	createdAt: Date;
	type: UserType;
	id?: string;
	spotifyRefreshToken?: string;
	musicKitToken?: string;
	verifiedEmail?: boolean
	constructor (opts: UserOptions) {
		if (opts.id) {
			this.id = opts.id;
		}
		if (opts.spotifyRefreshToken) {
			this.spotifyRefreshToken = opts.spotifyRefreshToken;
		}
		if (opts.musicKitToken) {
			this.musicKitToken = opts.musicKitToken;
		}
		if (opts.verifiedEmail) {
			this.verifiedEmail = opts.verifiedEmail;
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
			spotifyRefreshToken: doc.spotifyRefreshToken,
			musicKitToken: doc.musicKitToken,
			verifiedEmail: doc.verifiedEmail
		});
		this.id = doc.id;
	}
}

export class UserFromGoogleCredentials extends UserObj {
	constructor (credentials: GoogleCredential) {
		super({
			email: credentials.email,
			type: UserType.GOOGLE,
			verifiedEmail: true
		});
	}
}

export class UserFromSpotifyCredentials extends UserObj {
	constructor (credentials: SpotifyApi.UserObjectPrivate, spotifyRefreshToken?: string) {
		super({
			email: credentials.email,
			type: UserType.SPOTIFY,
			spotifyRefreshToken,
			verifiedEmail: true
		});
	}
}
