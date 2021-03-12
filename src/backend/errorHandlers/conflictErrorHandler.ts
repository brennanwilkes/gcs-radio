import { Request, Response } from "express";
import { ConflictError, Error } from "../../types/error";
import { print } from "../util/util";

export default (req: Request, res: Response) => (message: string, status = 409): void => {
	const error: Error = new ConflictError(message, req.originalUrl, status);

	print(JSON.stringify(error, null, 4));
	res.status(status).json({
		errors: [
			error
		]
	}).end();
};
