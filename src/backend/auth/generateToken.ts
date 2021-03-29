import jwt from "jsonwebtoken";
import { CONFIG } from "../util/util";

export default (id: string, expiresIn?: number): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		if (CONFIG.encryptionSecret) {
			jwt.sign(
				{ user: { id: id } },
				CONFIG.encryptionSecret,
				{ expiresIn: expiresIn ?? CONFIG.encryptionExpiryTime },
				(err: Error | null, token: string | undefined) => {
					if (err || !token) {
						reject(err?.message ?? "Internal Error");
					} else {
						resolve(token);
					}
				});
		} else {
			reject(new Error("Token secret not set"));
		}
	});
};
