import ytsr, { Item, Video } from "ytsr";
import ytdl from "ytdl-core";
import { YoutubeResult, YoutubeResultFromApi } from "../types/youtubeResult";

export function itemIsVideo (obj: Item): obj is Video {
	return obj.type === "video";
}

export function searchYoutubeSimple (query: string, limit = 5): Promise<string[]> {
	return new Promise((resolve, reject) => {
		ytsr(query, { limit: limit }).then(res => {
			resolve(res.items.filter(itemIsVideo).map(item => item.id));
		}).catch(err => {
			reject(err);
		});
	});
}

export function searchYoutubeDetailed (id: string): Promise<YoutubeResult> {
	return new Promise((resolve, reject) => {
		ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`)
			.then(res => {
				resolve(new YoutubeResultFromApi(res.videoDetails));
			})
			.catch(reject);
	});
}
