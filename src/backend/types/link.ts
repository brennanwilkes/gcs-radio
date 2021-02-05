import { Request } from "express";
import { SearchResult } from "./searchResult";

export interface Link {
	rel: string;
	action: string;
	href: string;
	types: string[];
}

export class LinkObj implements Link {
	rel: string
	action: string
	href: string
	types: string[]

	constructor (rel: string, action: string, href: string, types: string[]) {
		this.rel = rel;
		this.action = action;
		this.href = href;
		this.types = types;
	}
}

export class DownloadLink implements Link {
	rel: string
	action: string
	href: string
	types: string[]

	constructor (req: Request, song: SearchResult) {
		this.rel = "Download";
		this.action = "POST";
		this.href = `${req.baseUrl}/songs?id=${song.id}`;
		this.types = [
			"application/json"
		];
	}
}
