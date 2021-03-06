import jwt from "jsonwebtoken";

/* eslint-disable @typescript-eslint/ban-types */
export default function (payload: string | Buffer | object): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		if (!process.env.TOKEN_SECRET) {
			reject(new Error("Token secret not set"));
		} else {
			resolve(jwt.sign(payload, process.env.TOKEN_SECRET as string));
		}
	});
}

export function resolveSignedPayload (payload: string): Promise<string | object> {
	return new Promise<string | object>((resolve, reject) => {
		if (!process.env.TOKEN_SECRET) {
			reject(new Error("Token secret not set"));
		} else {
			resolve(jwt.verify(payload, process.env.TOKEN_SECRET as string));
		}
	});
}
/* eslint-enable @typescript-eslint/ban-types */
