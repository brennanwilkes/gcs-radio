import ua from "universal-analytics";
import { CONFIG } from "../util/util";
import { Error } from "../../types/error";
import { UserType } from "../../types/user";

/* eslint-disable no-unused-vars */
export enum EventType{
	SIGNUP = "SIGNUP",
	AUTH = "AUTH",
	EMAIL = "EMAIL",
	SPOTIFY_CONNECTION = "SPOTIFY_CONNECTION",
	DB_CONNECTION = "DB_CONNECTION",
	SERVER_UP = "SERVER_UP"
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

	errorHandler (error: any, _response: any, _body: any): void {
		if (error) {
			console.error(error);
		}
	}

	logError (err: Error, fatalOverride?: boolean) {
		const fatal: boolean = fatalOverride ?? (!!err.status && err.status >= 500);
		this.tracker.exception(`${err.error}: ${err.message}`, fatal).send(this.errorHandler);
	}

	logServerUp () {
		this.logEvent(EventType.SERVER_UP);
	}

	logSpotifyConnection () {
		this.logEvent(EventType.SPOTIFY_CONNECTION);
	}

	logDBConnection () {
		this.logEvent(EventType.DB_CONNECTION);
	}

	logEmail (subject: string, address: string) {
		this.logEvent(EventType.EMAIL, subject, address);
	}

	logSuccessfulAuth () {
		this.logEvent(EventType.AUTH);
	}

	logSignup (email: string, type: UserType) {
		this.logEvent(EventType.SIGNUP, type, email);
	}

	logEvent (category: string, action?: string, label?: string) {
		if (!action) {
			action = category;
		}
		if (!label) {
			label = action;
		}
		this.tracker.event(category, action, label, 42).send();
	}

	logApiCall (path: string) {
		this.tracker.pageview(path).send(this.errorHandler);
	}
}
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */
/* eslint-enable @typescript-eslint/no-explicit-any */

export default new Logger(CONFIG.googleTrackingId);
