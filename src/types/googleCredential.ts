import { oauth2_v2 as oauth2V2 } from "googleapis";

export interface GoogleCredential{
	email: string,
	name: string,
	picture?: string
}

export class GoogleCredentialObj implements GoogleCredential {
	email: string;
	name: string;
	picture?: string;
	constructor (email: string, name: string, picture?: string) {
		this.email = email;
		this.name = name;
		if (picture) {
			this.picture = picture;
		}
	}
}

export function googleCredentialFromApi (apiResult: oauth2V2.Schema$Userinfo): Promise<GoogleCredential> {
	return new Promise<GoogleCredential>((resolve, reject) => {
		if (apiResult.email && apiResult.name) {
			resolve(new GoogleCredentialObj(apiResult.email, apiResult.name, apiResult.picture as string | undefined));
		} else {
			reject(new Error("Invalid Schema from Google API"));
		}
	});
}
