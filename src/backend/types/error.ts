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

	constructor (error: string, path: string, message?: string, status?: number, timestamp?: Date) {
		this.error = error;
		this.path = path;
		this.message = message;
		this.status = status;
		this.timestamp = timestamp;
	}
}
