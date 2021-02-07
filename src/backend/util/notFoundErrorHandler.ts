import { Request, Response } from "express";
import { NotFoundError, Error } from "../types/error";
import { print } from "./util";

export default (req: Request, res: Response) => (resource: string, id: string) => {
	const error: Error = new NotFoundError(`Failed to find ${resource} with id ${id}`, req.originalUrl);

	print("Failed to find resource");
	print(JSON.stringify(error, null, 4));
	res.status(404).json({
		errors: [
			error
		]
	}).end();
};
