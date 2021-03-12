import { Result, ValidationError as ExpressValidationError } from "express-validator";
import { Request } from "express";

export interface Error{
	status?: number,
	timestamp?: Date,
	error: string,
	message?: string,
	path: string
}

export class ErrorObj implements Error {
	status?: number
	timestamp?: Date
	error: string
	message?: string
	path: string

	constructor (error: string, path: string, message?: string, status?: number, timestamp: Date = new Date()) {
		this.error = error;
		this.path = path;
		this.message = message;
		this.status = status;
		this.timestamp = timestamp;
	}
}

export class ErrorFromException extends ErrorObj implements Error {
	constructor (exception: string, path: string) {
		super("Inernal Error", path, exception, 500);
	}
}

export class NotFoundError extends ErrorObj implements Error {
	constructor (exception: string, path: string) {
		super("Not Found", path, exception, 404);
	}
}

export class InvalidLoginError extends ErrorObj implements Error {
	constructor (user: string, path: string, status = 401) {
		super("Invalid Login", path, `Failed to login to ${user}`, status);
	}
}

export class AccessDeniedError extends ErrorObj implements Error {
	constructor (resource: string, path: string, status = 401) {
		super("Access Denied", path, `Invalid permissions to access ${resource}`, status);
	}
}

export class ConflictError extends ErrorObj implements Error {
	constructor (message: string, path: string, status = 409) {
		super(`Resource already exists`, path, message, status);
	}
}

export class ValidationError extends ErrorObj implements Error {
	constructor (errors: Result<ExpressValidationError>, req: Request, status = 422) {
		const err = errors.array()[0];
		const msg = err.nestedErrors && err.nestedErrors.length > 0 ? (err.nestedErrors as ExpressValidationError[])[0].msg : err.msg;
		super(
			`Invalid ${err.location} parameter ${err.param} "${err.value}"`,
			req.originalUrl,
			msg,
			status
		);
	}
}

export class AuthorizationError extends ErrorObj implements Error {
	constructor (errors: Result<ExpressValidationError>, req: Request, status = 401) {
		const err = errors.array({ onlyFirstError: true })[0];
		super("Authorization Error", req.originalUrl, `Invalid token "${err.value}"`, status);
	}
}
