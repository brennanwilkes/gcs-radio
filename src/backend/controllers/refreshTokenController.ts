import { Request, Response } from "express";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import axios from "axios";
import querystring from "querystring";

export default (req: Request, res: Response): void => {
	const refreshToken = req.body.refresh_token;

	const clientId = process.env.SPOTIFY_ID;
	const clientSecret = process.env.SPOTIFY_SECRET;
	if (!clientId || !clientSecret) {
		internalErrorHandler(req, res)("No spotify credentials detected");
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
				res.status(200).json({
					access_token: resp.data.access_token
				});
			} else {
				internalErrorHandler(req, res)("Invalid access token");
			}
		}).catch(internalErrorHandler(req, res));
	}
};
