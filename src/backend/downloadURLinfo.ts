import youtubedl from "youtube-dl";
import VideoDataObj, { VideoData } from "./videoData";

export default function (url: string): Promise<VideoData> {
	return new Promise((resolve, reject) => {
		youtubedl.getInfo(url, [], function (err, info: any) {
			if (err) {
				reject(err);
			}
			resolve(new VideoDataObj(
				info.upload_date ?? "20200202",
				info.duration ?? "0:00",
				info.fulltitle ?? "Unknown",
				info.album ?? "Unknown",
				info.title ?? "Unknown",
				info.id ?? "Unknown",
				info.tags ?? [],
				info.track ?? "Unknown",
				info.thumbnails ?? [],
				info.artist ?? "Unknown"
			));
		});
	});
}
