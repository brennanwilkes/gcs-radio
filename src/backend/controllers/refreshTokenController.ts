import { Request, Response } from "express";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import getUserAccessToken from "../spotify/getUserAccessToken";

export default (req: Request, res: Response): void => {
	getUserAccessToken(req.body.refresh_token).then(accessToken => {
		res.status(200).json({
			access_token: accessToken
		});
	}).catch(internalErrorHandler(req, res));
};
