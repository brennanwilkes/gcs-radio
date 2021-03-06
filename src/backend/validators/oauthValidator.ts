import { query } from "express-validator";
import { authErrorHandler } from "./validatorUtil";
import { Request, Response, NextFunction } from "express";
import { resolveSignedPayload } from "../auth/signPayload";
import internalErrorHandler from "../util/internalErrorHandler";
import { generateGoogleRedirectURI } from "../controllers/oauthGoogleController";
import { generateSpotifyRedirectURI } from "../controllers/oauthSpotifyController";

const googleValidator = [
	(req: Request, res: Response, next: NextFunction): void => {
		if (req.cookies.googleAccessCode) {
			resolveSignedPayload(req.cookies.googleAccessCode).then(code => {
				res.redirect(`${generateGoogleRedirectURI(req)}?code=${encodeURIComponent(code as string)}`);
			}).catch(internalErrorHandler(req, res));
		} else {
			next();
		}
	}
];

const spotifyValidator = [
	(req: Request, res: Response, next: NextFunction): void => {
		if (req.cookies.spotifyAccessCode) {
			resolveSignedPayload(req.cookies.spotifyAccessCode).then(code => {
				res.redirect(`${generateSpotifyRedirectURI(req)}?code=${encodeURIComponent(code as string)}`);
			}).catch(internalErrorHandler(req, res));
		} else {
			next();
		}
	}
];

const oauthValidator = [
	query("error").not().exists(),
	query("code").exists(),
	authErrorHandler
];

export { oauthValidator, googleValidator, spotifyValidator };
