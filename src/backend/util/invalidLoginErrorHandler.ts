import { Request, Response } from "express";
import { InvalidLoginError, Error } from "../../types/error";
import { print } from "./util";

export default (req: Request, res: Response) => (user: string, status = 401): void => {
	const error: Error = new InvalidLoginError(user, req.originalUrl, status);

	print("Invalid Login");
	print(JSON.stringify(error, null, 4));
	res.status(status).json({
		errors: [
			error
		]
	}).end();
};
