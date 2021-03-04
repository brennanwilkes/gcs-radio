import { Request, Response } from "express";
import { CONFIG } from "../util/util";
import { google } from "googleapis";
import internalErrorHandler from "../util/internalErrorHandler";
import jwt from "jsonwebtoken";
// import { Credentials } from "google-auth-library";

const oauth2 = google.oauth2("v2");
const OAuth2 = google.auth.OAuth2;

const OAuthFromReq = (req: Request) => {
	return new OAuth2(
		process.env.GOOGLE_CLIENT_ID as string,
		process.env.GOOGLE_CLIENT_SECRET as string,
		`${req.protocol}://${req.get("host")}/oauth/callback`
	);
};

const redirectToGoogle = (req: Request, res: Response): void => {
	if (!process.env.GOOGLE_CLIENT_ID) {
		internalErrorHandler(req, res)("Google OAUTH ID not set");
	} else if (!process.env.GOOGLE_CLIENT_SECRET) {
		internalErrorHandler(req, res)("Google OAUTH secret not set");
	} else {
		res.redirect(OAuthFromReq(req).generateAuthUrl({
			access_type: "offline",
			scope: CONFIG.oauth2Credentials.scope
		}));
	}
};

const redirectFromGoogle = (req: Request, res:Response): void => {
	if (!process.env.GOOGLE_CLIENT_ID) {
		internalErrorHandler(req, res)("Google OAUTH ID not set");
	} else if (!process.env.GOOGLE_CLIENT_SECRET) {
		internalErrorHandler(req, res)("Google OAUTH secret not set");
	} else if (!process.env.TOKEN_SECRET) {
		internalErrorHandler(req, res)("Token secret not set");
	} else {
		if (req.query.error || !req.query.code) {
			res.redirect("/");
		} else {
			const authClient = OAuthFromReq(req);
			authClient.getToken(req.query.code as string, (err, token) => {
				if (err || !token) {
					res.redirect("/");
				} else {
					// Store the credentials given by google into a jsonwebtoken in a cookie called 'jwt'
					const key: string = process.env.TOKEN_SECRET as string;
					const signedToken = jwt.sign(token, key);
					res.cookie("jwt", signedToken);

					// authClient.credentials = jwt.verify(signedToken, key) as Credentials;
					authClient.setCredentials({
						access_token: token.access_token
					});

					oauth2.userinfo.get({
						auth: authClient
					}, (err, data) => {
						if (!err && data) {
							res.status(200).json(data);
						} else {
							res.status(500).send(err);
						}
					});
					// res.redirect("/app");
				}
			});
		}
	}
};

export { redirectToGoogle, redirectFromGoogle };
