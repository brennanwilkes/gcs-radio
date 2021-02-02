import youtubedl from "youtube-dl";
import VideoDataObj, {VideoData} from "./videoData";

export default function(url: string): Promise<VideoData>{
	return new Promise((resolve, reject) => {
		youtubedl.getInfo(url, [], function(err, info: any) {
			if (err){
				reject();
			}
			resolve(new VideoDataObj(
				info.upload_date ?? "",
				info.duration ?? "",
				info.fulltitle ?? "",
				info.album ?? "",
				info.title ?? "",
				info.creator ?? "",
				info.id ?? "",
				info.tags ?? [],
				info.track ?? "",
				info.thumbnails ?? [],
				info.artist ?? ""
			));
		})
	});
}
