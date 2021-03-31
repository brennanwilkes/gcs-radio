import { CONFIG } from "../util/util";
import axios from "axios";
import querystring from "querystring";

export default (refreshToken: string): Promise<string> => {
	return new Promise<string>((resolve, reject) => {
		const clientId = CONFIG.spotifyClientId;
		const clientSecret = CONFIG.spotifyClientSecret;
		if (!clientId || !clientSecret) {
			reject(new Error("No spotify credentials detected"));
		} else {
			const headers = {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`
				}
			};
			const data = {
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: "refresh_token",
				refresh_token: refreshToken
			};
			axios.post(
				`https://accounts.spotify.com/api/token`,
				querystring.stringify(data),
				headers
			).then(resp => {
				if (resp.data?.access_token) {
					resolve(resp.data.access_token);
				} else {
					reject(new Error("Invalid access token"));
				}
			}).catch(reject);
		}
	});
};
