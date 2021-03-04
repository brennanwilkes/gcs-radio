import jwt from "jsonwebtoken";

export default (id: string): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		if (process.env.TOKEN_SECRET) {
			jwt.sign(
				{ user: { id: id } },
				process.env.TOKEN_SECRET,
				{ expiresIn: 3600 },
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
