import { Request } from "express";

import analyticsConfig from "../../config/analytics";
import emailConfig from "../../config/email";
import googleOauthConfig from "../../config/googleOauth";
import spotifyOauthConfig from "../../config/spotifyOauth";
import serverConfig from "../../config/server";
import youtubeURLMethod from "../../config/youtubeURL";

// Store all backend config vars here
import "dotenv/config";

export const CONFIG = {
	...serverConfig,
	googleOauth2Credentials: googleOauthConfig,
	spotifyOauth2Credentials: spotifyOauthConfig,
	...emailConfig,
	...analyticsConfig,
	youtubeURLMethod
};

/**
	Prints to stdout if verbose config mode is set
	@param {string[]} content Content strings to print
	@memberof backend
*/
export const print = function (...content: string[]): void {
	if (CONFIG.verbose) console.log(...content);
};

export const generateDashboardRedirect = (req: Request): string => `${req.protocol}://${req.get("host")}/dashboard`;
