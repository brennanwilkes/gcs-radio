import { Request, Response } from "express";
import { CONFIG } from "../util/util";
import { google } from "googleapis";
import internalErrorHandler from "../util/internalErrorHandler";

const OAuth2 = google.auth.OAuth2;

const redirectToGoogle = (req: Request, res: Response): void => {
	if (!process.env.GOOGLE_CLIENT_ID) {
		internalErrorHandler(req, res)("Google OAUTH ID not set");
	} else if (!process.env.GOOGLE_CLIENT_SECRET) {
		internalErrorHandler(req, res)("Google OAUTH secret not set");
	} else {
		const oauth2Client = new OAuth2(
			process.env.GOOGLE_CLIENT_ID as string,
			process.env.GOOGLE_CLIENT_SECRET as string,
			`${(req.protocol + "://" + req.get("host") + req.originalUrl).replace(/\/$/, "")}/callback`
		);

		const loginLink = oauth2Client.generateAuthUrl({
			access_type: "offline",
			scope: CONFIG.oauth2Credentials.scope
		});
		res.redirect(302, loginLink);
	}
};

export { redirectToGoogle };
