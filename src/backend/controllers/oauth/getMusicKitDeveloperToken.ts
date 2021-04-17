import { Request, Response } from "express";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import generateDeveloperToken from "../../musicKit/generateDeveloperToken";

export default (req: Request, res:Response): void => {
	generateDeveloperToken().then(token => {
		res.status(200).json({
			token
		});
	}).catch(internalErrorHandler(req, res));
};
