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
/* eslint-enable @typescript-eslint/ban-types */
