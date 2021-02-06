import { Video } from "ytsr";

export interface SearchResult {
	title: string;
	id: string;
	thumbnail: string | null;
}

export default class SearchResultObj implements SearchResult {
	title: string;
	id: string;
	thumbnail: string | null;
	constructor (result: Video | SearchResult) {
		this.title = result.title;
		this.id = result.id;
		this.thumbnail = "bestThumbnail" in result ? result.bestThumbnail.url : result.thumbnail;
	}
}
