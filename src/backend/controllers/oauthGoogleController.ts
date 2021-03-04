import { Request, Response } from "express";
import { CONFIG } from "../util/util";
import { google } from "googleapis";
import fs from "fs";
import internalErrorHandler from "../util/internalErrorHandler";

const OAuth2 = google.auth.OAuth2;

const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS ? JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS as string, "utf8")) : undefined;

const redirectToGoogle = (req: Request, res: Response): void => {
	if (!process.env.GOOGLE_PROJECT) {
		internalErrorHandler(req, res)("Google project not set");
	} else if (!GOOGLE_APPLICATION_CREDENTIALS || !GOOGLE_APPLICATION_CREDENTIALS.client_id || !GOOGLE_APPLICATION_CREDENTIALS.private_key) {
		internalErrorHandler(req, res)("Google application credentials not set");
	} else {
		const oauth2Client = new OAuth2(
			GOOGLE_APPLICATION_CREDENTIALS.client_id,
			GOOGLE_APPLICATION_CREDENTIALS.private_key,
			`${(req.protocol + "://" + req.get("host") + req.originalUrl).replace(/\/$/, "")}/callback`
		);

		const loginLink = oauth2Client.generateAuthUrl({
			access_type: "offline",
			scope: CONFIG.oauth2Credentials.scope
		});

		console.dir(loginLink);
		res.redirect(302, loginLink);
	}
};

export { redirectToGoogle };
