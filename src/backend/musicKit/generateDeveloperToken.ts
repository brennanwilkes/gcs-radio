import { CONFIG } from "../util/util";
import jwt from "jsonwebtoken";
import fs from "fs";

export default (): Promise<string> => new Promise<string>((resolve, reject) => {
	if (!CONFIG.musicKitKeyId) {
		reject(new Error("MusicKit Key ID not set"));
	} else if (!CONFIG.musicKitTeamId) {
		reject(new Error("MusicKit Team ID not set"));
	} else if (!CONFIG.musicKitSecret) {
		reject(new Error("MusicKit Secret not set"));
	} else {
		fs.readFile(CONFIG.musicKitSecret, (err: Error | null, data: Buffer): void => {
			if (err) {
				reject(err);
			} else {
				resolve(jwt.sign({}, data.toString(), {
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
	}
});
