import { Request, Response } from "express";
import searchYoutube from "../youtube/searchYoutube";
import { ApiSearchResultObj } from "../types/apiSearchResult";
import { print } from "../util/util";
import internalErrorHandler from "../util/internalErrorHandler";

const query = (req: Request, res: Response) => {
	print(`Handling request for query search "${req.query.query}"`);

	searchYoutube(String(req.query.query)).then(results => {
		print(`Responding with song resources`);
		res.send({
			songs: results.map(song => new ApiSearchResultObj(song, req))
		});
	}).catch(internalErrorHandler(req, res));
};

export { query };
