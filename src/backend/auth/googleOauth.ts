import { google } from "googleapis";
import { Credentials, OAuth2Client } from "google-auth-library";
import signPayload from "./signPayload";
import { GoogleCredential, googleCredentialFromApi } from "../../types/googleCredential";

const oauth2 = google.oauth2("v2");
const OAuth2 = google.auth.OAuth2;

export function getGoogleEnv (): Promise<{id:string, secret: string}> {
	return new Promise<{id:string, secret: string}>((resolve, reject) => {
		if (!process.env.GOOGLE_CLIENT_ID) {
			reject(new Error("Google OAUTH ID not set"));
		} else if (!process.env.GOOGLE_CLIENT_SECRET) {
			reject(new Error("Google OAUTH secret not set"));
		} else {
			resolve({
				id: process.env.GOOGLE_CLIENT_ID,
				secret: process.env.GOOGLE_CLIENT_SECRET
			});
		}
	});
}

export function oath2FromCredentials (args?: string): Promise<OAuth2Client> {
	return new Promise<OAuth2Client>((resolve, reject) => {
		getGoogleEnv().then(env => {
			resolve(new OAuth2(env.id, env.secret, args));
		}).catch(reject);
	});
}

export function getTokenFromCode (code: string): Promise<Credentials> {
	return new Promise<Credentials>((resolve, reject) => {
		oath2FromCredentials().then(authClient => {
			authClient.getToken(code, (err, token) => {
				if (err || !token) {
					console.error(err);
					console.error(code);
					console.dir(authClient);
					reject(err ?? new Error("Google AUTH code contains invalid or no token"));
				} else {
					resolve(token);
				}
			});
		}).catch(reject);
	});
}

export function getSignedTokenFromCode (code: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		getTokenFromCode(code).then(token => {
			signPayload(token).then(resolve).catch(reject);
		}).catch(reject);
	});
}

export function getUserInfoFromToken (token: Credentials): Promise<GoogleCredential> {
	return new Promise<GoogleCredential>((resolve, reject) => {
		oath2FromCredentials().then(authClient => {
			authClient.setCredentials({
				access_token: token.access_token
			});

			oauth2.userinfo.get({
				auth: authClient
			}, (err, data) => {
				if (!err && data) {
					googleCredentialFromApi(data.data).then(resolve).catch(reject);
				} else {
					reject(err);
				}
			});
		}).catch(reject);
	});
}
