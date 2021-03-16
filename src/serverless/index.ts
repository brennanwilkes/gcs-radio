import { Request, Response } from "express";

import { postSong } from "../backend/controllers/songController";
import internalErrorHandler from "../backend/errorHandlers/internalErrorHandler";
import validators from "../backend/validators/postSongValidator";

console.dir(__dirname);

export async function serverless (req: Request, res: Response): Promise<void> {
	res.set("Access-Control-Allow-Origin", "*");

	if (req.method === "OPTIONS") {
		res.set("Access-Control-Allow-Headers", "Content-Type,Content-Length,Server,Date,access-control-allow-methods,access-control-allow-origin");
		res.status(204).end();
	} else if (req.method === "POST") {
		Promise.all(validators.map(validation => validation.run(req))).then(() => {
			postSong(req, res);
		}).catch(internalErrorHandler(req, res));
	} else {
		res.send("Unsupported request");
	}
}
