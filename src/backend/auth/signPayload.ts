import jwt from "jsonwebtoken";
import { CONFIG } from "../util/util";

/* eslint-disable @typescript-eslint/ban-types */
export default function (payload: string | Buffer | object): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		if (!CONFIG.encryptionSecret) {
			reject(new Error("Token secret not set"));
		} else {
			jwt.sign(payload, CONFIG.encryptionSecret, (err: Error | null, encoded: string | undefined) => {
				if (err || !encoded) {
					reject(err);
				} else {
					resolve(encoded);
				}
			});
		}
	});
}

export function resolveSignedPayload (payload: string): Promise<string | object> {
	return new Promise<string | object>((resolve, reject) => {
		if (!CONFIG.encryptionSecret) {
			reject(new Error("Token secret not set"));
		} else {
			jwt.verify(payload, CONFIG.encryptionSecret, (err: Error | null, encoded: string | object | undefined) => {
				if (err || !encoded) {
					reject(err);
				} else {
					resolve(encoded);
				}
			});
		}
	});
}
/* eslint-enable @typescript-eslint/ban-types */
