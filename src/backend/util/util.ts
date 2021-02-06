
// Store all backend config vars here
import "dotenv/config";

export const CONFIG = {
	port: parseInt(process.env.PORT ?? "8080"),
	verbose: !!(process.env.VERBOSE ?? false)
};

/**
	Prints to stdout if verbose config mode is set
	@param {string[]} content Content strings to print
	@memberof backend
*/
export const print = function (...content: string[]): void {
	if (CONFIG.verbose) console.log(...content);
};
