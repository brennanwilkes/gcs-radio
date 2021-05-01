import { CONFIG } from "../util/util";
import jwt from "jsonwebtoken";

export default (): Promise<string> => new Promise<string>((resolve, reject) => {
	if (!CONFIG.musicKitKeyId) {
		reject(new Error("MusicKit Key ID not set"));
	} else if (!CONFIG.musicKitTeamId) {
		reject(new Error("MusicKit Team ID not set"));
	} else if (!CONFIG.musicKitSecret) {
		reject(new Error("MusicKit Secret not set"));
	} else {
		resolve(jwt.sign({}, CONFIG.musicKitSecret, {
			algorithm: "ES256",
			expiresIn: CONFIG.musicKitTokenExpiry,
			issuer: CONFIG.musicKitTeamId,
			header: {
				alg: "ES256",
				kid: CONFIG.musicKitKeyId
			}
		}));
	}
});
