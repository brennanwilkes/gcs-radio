import ytsr, { Item, Video } from "ytsr";
import { getInfo } from "ytdl-core";
import { DummyYoutubeResult, YoutubeResult, YoutubeResultFromApi } from "../../types/youtubeResult";
import cookieParams from "../util/cookies";
import { CONFIG } from "../util/util";

export function itemIsVideo (obj: Item): obj is Video {
	return obj.type === "video";
}

export function searchYoutubeSimple (query: string, limit = 5): Promise<string[]> {
	if (!CONFIG.matchWithYoutube) {
		return Promise.resolve(["DEFAULT"]);
	}
	return new Promise((resolve, reject) => {
		ytsr(query, { ...cookieParams, limit: limit * 2 }).then(res => {
			resolve(res.items.filter(itemIsVideo).map(item => item.id).slice(0, limit));
		}).catch(err => {
			reject(err);
		});
	});
}

export function searchYoutubeDetailed (id: string): Promise<YoutubeResult> {
	if (!CONFIG.matchWithYoutube) {
		return Promise.resolve(new DummyYoutubeResult(id));
	}
	return new Promise((resolve, reject) => {
		getInfo(`https://www.youtube.com/watch?v=${id}`, cookieParams)
			.then(res => {
				resolve(new YoutubeResultFromApi(res));
			})
			.catch(reject);
	});
}
