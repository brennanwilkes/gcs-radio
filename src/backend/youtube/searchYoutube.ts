import ytsr, { Item, Video } from "ytsr";
import ytdl from "ytdl-core";
import { YoutubeResult, YoutubeResultFromApi } from "../../types/youtubeResult";
import cookieParams from "../util/cookies";

export function itemIsVideo (obj: Item): obj is Video {
	return obj.type === "video";
}

export function searchYoutubeSimple (query: string, limit = 5): Promise<string[]> {
	return new Promise((resolve, reject) => {
		ytsr(query, { ...cookieParams, limit: limit }).then(res => {
			resolve(res.items.filter(itemIsVideo).map(item => item.id));
		}).catch(err => {
			reject(err);
		});
	});
}

export function searchYoutubeDetailed (id: string): Promise<YoutubeResult> {
	return new Promise((resolve, reject) => {
		ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`, cookieParams)
			.then(res => {
				resolve(new YoutubeResultFromApi(res));
			})
			.catch(reject);
	});
}
