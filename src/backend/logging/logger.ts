import ua from "universal-analytics";
import { CONFIG } from "../util/util";
import { Error } from "../../types/error";
import { UserType } from "../../types/user";

/* eslint-disable no-unused-vars */
export enum EventType{
	SIGNUP = "SIGNUP",
}
/* eslint-enable no-unused-vars */

export class Logger {
	tracker: ua.Visitor;
	trackingId = CONFIG.googleTrackingId;
	constructor () {
		this.tracker = ua(this.trackingId);
	}

	logError (err: Error, fatalOverride?: boolean) {
		const fatal: boolean = fatalOverride ?? (!!err.status && err.status >= 500);
		this.tracker.exception(`${err.error}: ${err.message}`, fatal);
		console.dir("LOGGED ERR");
	}

	logSignup (email: string, type: UserType) {
		this.tracker.event({
			ec: EventType.SIGNUP,
			ea: type,
			ev: email
		});
		console.dir("LOGGED SIGNUP");
	}
}

export default new Logger();
