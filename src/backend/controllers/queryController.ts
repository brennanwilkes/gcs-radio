import { Request, Response } from "express";
import searchYoutube from "../youtube/searchYoutube";
import { ApiSearchResultObj } from "../types/apiSearchResult";

const query = (req: Request, res: Response) => {
	searchYoutube(String(req.query.query)).then(results => {
		res.send({
			songs: results.map(song => new ApiSearchResultObj(song, req))
		});
	}).catch(err => {
		res.status(500).send({
			errors: [
				err
			]
		});
	});
};

export { query };
