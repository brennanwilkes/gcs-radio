
import { Request, Response } from "express";
import { AccessDeniedError, Error } from "../../types/error";
import { print } from "../util/util";

export default (req: Request, res: Response) => (resource: string, status = 401): void => {
	const error: Error = new AccessDeniedError(resource, req.originalUrl, status);

	print(JSON.stringify(error, null, 4));
	res.status(status).json({
		errors: [
			error
		]
	}).end();
};
