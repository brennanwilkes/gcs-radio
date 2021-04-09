import { Request, Response } from "express";
import { CONFIG } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { oath2FromCredentials } from "../../auth/googleOauth";

import generateGoogleRedirectURI from "./generateGoogleRedirectURI";

// Redirect to google oauth
export default (req: Request, res: Response): void => {
	oath2FromCredentials(generateGoogleRedirectURI(req)).then(oauthClient => {
		res.redirect(oauthClient.generateAuthUrl({
			access_type: "offline",
			scope: CONFIG.googleOauth2Credentials.scope
		}));
	}).catch(internalErrorHandler(req, res));
};
