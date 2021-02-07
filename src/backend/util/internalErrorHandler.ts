import { Request, Response } from "express";
import { ErrorFromException, Error } from "../types/error";
import { print } from "./util";

export default (req: Request, res: Response) => (err: any) => {
	const error: Error = new ErrorFromException(err, req.originalUrl);
	print("Internal Error:");
	print(JSON.stringify(error, null, 4));
	res.status(500).json({
		errors: [
			error
		]
	}).end();
};
