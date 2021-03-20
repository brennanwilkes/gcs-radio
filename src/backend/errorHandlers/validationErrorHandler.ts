import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../types/error";
import { print } from "../util/util";

export default (req: Request, res: Response, next: NextFunction): Response | undefined => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		const err = new ValidationError(errors, req);
		print(JSON.stringify(err, null, 4));
		return res.status(422).json({
			errors: [err]
		});
	}
	next();
};
