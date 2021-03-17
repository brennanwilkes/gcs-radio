import { Request } from "express";

import analyticsConfig from "../../config/analytics";
import emailConfig from "../../config/email";
import googleConfig from "../../config/google";
import spotifyConfig from "../../config/spotify";
import miscConfig from "../../config/miscellaneous";
import youtubeURLMethod from "../../config/youtubeURL";

// Store all backend config vars here
import "dotenv/config";

export const CONFIG = {
	...miscConfig,
	googleOauth2Credentials: googleConfig.oauth2,
	...googleConfig.credentials,
	spotifyOauth2Credentials: spotifyConfig.oauth2,
	...spotifyConfig.credentials,
	...emailConfig,
	...analyticsConfig,
	youtubeURLMethod
};

console.dir(process.env.DB_CONNECTION);
console.dir(CONFIG);

/**
	Prints to stdout if verbose config mode is set
	@param {string[]} content Content strings to print
	@memberof backend
*/
export const print = function (...content: string[]): void {
	if (CONFIG.verbose) console.log(...content);
};

export const generateDashboardRedirect = (req: Request): string => `${req.protocol}://${req.get("host")}/dashboard`;
