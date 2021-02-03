import ytsr from "ytsr";
import SearchResultObj, { SearchResult } from "../types/searchResult";

export default function (query: string): Promise<SearchResult[]> {
	return new Promise((resolve, reject) => {
		ytsr(query, { limit: 15 }).then(res => {
			res.items = res.items.filter(item => item.type === "video");
			let filtered: SearchResult[] = [];

			const items: any[] = res.items.slice(0, 5);
			items.forEach(item => {
				filtered = [...filtered, new SearchResultObj(item)];
			});

			resolve(filtered);
		}).catch(err => {
			reject(err);
		});
	});
}
