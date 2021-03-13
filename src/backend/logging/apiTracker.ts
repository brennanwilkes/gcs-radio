import { Request, Response, NextFunction } from "express";
import { mongoIdRegex } from "../validators/validatorUtil";
import logger from "./logger";

export default (req: Request, _res: Response, next: NextFunction): void => {
	let path = req.baseUrl + req.path;
	path = path.replace(mongoIdRegex, "");
	path = path.replace(/\/$/, "");
	logger.logApiCall(path);
	next();
};
