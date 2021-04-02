import ua from "universal-analytics";
import { CONFIG } from "../util/util";
import { Error } from "../../types/error";
import { UserType } from "../../types/user";

/* eslint-disable no-unused-vars */
export enum EventType{
	SIGNUP = "SIGNUP",
}
/* eslint-enable no-unused-vars */

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class Logger {
	tracker: ua.Visitor;
	trackingId: string;
	constructor (trackingId: string) {
		this.trackingId = trackingId;
		this.tracker = ua(trackingId);
	}

	errorHandler (error: any, response: any, body: any): void {
		if (error) {
			console.error(error);
			console.dir(response);
			console.dir(body);
		}
	}

	logError (err: Error, fatalOverride?: boolean) {
		const fatal: boolean = fatalOverride ?? (!!err.status && err.status >= 500);
		this.tracker.exception(`${err.error}: ${err.message}`, fatal).send(this.errorHandler);
	}

	logSignup (email: string, type: UserType) {
		this.tracker.event({
			ec: EventType.SIGNUP,
			ea: type,
			ev: email
		}).send(this.errorHandler);
	}

	logApiCall (path: string) {
		this.tracker.pageview(path).send(this.errorHandler);
	}
}
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
/* eslint-enable @typescript-eslint/no-explicit-any */

export default new Logger(CONFIG.googleTrackingId);
