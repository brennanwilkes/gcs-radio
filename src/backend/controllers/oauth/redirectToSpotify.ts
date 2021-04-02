import { Request, Response } from "express";
import { CONFIG } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import connection from "../../spotify/connection";

import generateSpotifyRedirectURI from "./generateSpotifyRedirectURI";

export default (req: Request, res: Response): void => {
	if (!CONFIG.spotifyClientId) {
		internalErrorHandler(req, res)("Spotify application ID not set");
	} else {
		connection.then(spotifyApi => {
			spotifyApi.setRedirectURI(generateSpotifyRedirectURI(req));
			res.redirect(spotifyApi.createAuthorizeURL(CONFIG.spotifyOauth2Credentials.scope, ""));
		}).catch(internalErrorHandler(req, res));
	}
};
