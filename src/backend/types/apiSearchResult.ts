import { Link, DownloadLink } from "./link";
import { Request } from "express";
import { Video } from "ytsr";
import SearchResultObj, { SearchResult } from "./searchResult";

export interface ApiSearchResult extends SearchResult{
	links: Link[]
}

export class ApiSearchResultObj extends SearchResultObj implements ApiSearchResult {
	links: DownloadLink[]
	constructor (result: Video | SearchResult, req:Request) {
		super(result);
		this.links = [
			new DownloadLink(req, this)
		];
	}
}
