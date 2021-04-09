import { google } from "googleapis";
import { Credentials, OAuth2Client } from "google-auth-library";
import signPayload from "./signPayload";
import { GoogleCredential, googleCredentialFromApi } from "../../types/googleCredential";
import { CONFIG } from "../util/util";

const oauth2 = google.oauth2("v2");
const OAuth2 = google.auth.OAuth2;

export function getGoogleEnv (): Promise<{id:string, secret: string}> {
	return new Promise<{id:string, secret: string}>((resolve, reject) => {
		if (!CONFIG.googleClientId) {
			reject(new Error("Google OAUTH ID not set"));
		} else if (!CONFIG.googleClientSecret) {
			reject(new Error("Google OAUTH secret not set"));
		} else {
			resolve({
				id: CONFIG.googleClientId,
				secret: CONFIG.googleClientSecret
			});
		}
	});
}

export function oath2FromCredentials (redirectUri: string): Promise<OAuth2Client> {
	return new Promise<OAuth2Client>((resolve, reject) => {
		getGoogleEnv().then(env => {
			resolve(new OAuth2(env.id, env.secret, redirectUri));
		}).catch(reject);
	});
}

export function getTokenFromCode (code: string, redirectURI: string): Promise<Credentials> {
	return new Promise<Credentials>((resolve, reject) => {
		oath2FromCredentials(redirectURI).then(authClient => {
			authClient.getToken(code, (err, token) => {
				if (err || !token) {
					reject(err ?? new Error("Google AUTH code contains invalid or no token"));
				} else {
					resolve(token);
				}
			});
		}).catch(reject);
	});
}

export function getSignedTokenFromCode (code: string, redirectURI: string): Promise<string> {
	return getTokenFromCode(code, redirectURI).then(signPayload);
}

export function getUserInfoFromToken (token: Credentials, redirectURI: string): Promise<GoogleCredential> {
	return new Promise<GoogleCredential>((resolve, reject) => {
		oath2FromCredentials(redirectURI).then(authClient => {
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
