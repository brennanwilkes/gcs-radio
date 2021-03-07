import jwt from "jsonwebtoken";

/* eslint-disable @typescript-eslint/ban-types */
export default function (payload: string | Buffer | object): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		if (!process.env.TOKEN_SECRET) {
			reject(new Error("Token secret not set"));
		} else {
			jwt.sign(payload, process.env.TOKEN_SECRET as string, (err: Error | null, encoded: string | undefined) => {
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
		if (!process.env.TOKEN_SECRET) {
			reject(new Error("Token secret not set"));
		} else {
			jwt.verify(payload, process.env.TOKEN_SECRET as string, (err: Error | null, encoded: string | object | undefined) => {
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
