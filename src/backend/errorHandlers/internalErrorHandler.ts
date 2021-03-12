import { Request, Response } from "express";
import { ErrorFromException, Error } from "../../types/error";
import { print } from "../util/util";

export default (req: Request, res: Response) => (err: string): void => {
	const error: Error = new ErrorFromException(String(err), req.originalUrl);
	print("Internal Error:");
	print(JSON.stringify(error, null, 4));
	res.status(500).json({
		errors: [
			error
		]
	}).end();
};
