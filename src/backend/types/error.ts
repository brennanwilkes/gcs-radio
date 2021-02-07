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
	constructor (exception: any, path: string) {
		super("Inernal Error", path, `${exception}`, 500);
	}
}

export class NotFoundError extends ErrorObj implements Error {
	constructor (exception: string, path: string) {
		super("Not Found", path, exception, 404);
	}
}
