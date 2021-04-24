import { Request } from "express";

// Store all backend config vars here
import "dotenv/config";

import analyticsConfig from "../../config/analytics";
import emailConfig from "../../config/email";
import googleConfig from "../../config/google";
import spotifyConfig from "../../config/spotify";
import miscConfig from "../../config/miscellaneous";

export const CONFIG = {
	...miscConfig,
	googleOauth2Credentials: googleConfig.oauth2,
	...googleConfig.credentials,
	spotifyOauth2Credentials: spotifyConfig.oauth2,
	...spotifyConfig.credentials,
	...emailConfig,
	...analyticsConfig
};

/**
	Prints to stdout if verbose config mode is set
	@param {string[]} content Content strings to print
	@memberof backend
*/
export const print = function (...content: string[]): void {
	if (CONFIG.verbose) console.log(...content);
};

export const getPage = (req: Request):number => (req.query.page as number | undefined) ?? 1;
export const getLimit = (req: Request):number => (req.query.limit as number | undefined) ?? CONFIG.defaultApiLimit;

export const generateDashboardRedirect = (req: Request): string => `${req.protocol}://${req.get("host")}/dashboard`;
