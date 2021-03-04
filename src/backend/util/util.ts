
// Store all backend config vars here
import "dotenv/config";

export const CONFIG = {
	port: parseInt(process.env.PORT ?? "8080"),
	verbose: !!(process.env.VERBOSE ?? false),
	oauth2Credentials: {
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		token_uri: "https://oauth2.googleapis.com/token",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
		scope: ["email", "profile", "openid"]
	}
};

/**
	Prints to stdout if verbose config mode is set
	@param {string[]} content Content strings to print
	@memberof backend
*/
export const print = function (...content: string[]): void {
	if (CONFIG.verbose) console.log(...content);
};
