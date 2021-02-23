import ytdl from "ytdl-core";
import dummyPipe from "../util/dummyPipe";
import { Transform } from "stream";
import streamVidToAudio from "../util/streamVidToAudio";
import cookieParams from "../util/cookies";
// import HttpsProxyAgent from "https-proxy-agent";

// const proxy = "http://64.235.204.107:3128";
// const agent = HttpsProxyAgent(proxy);

export default function (url: string, formats: ytdl.videoFormat[]): Promise<Transform> {
	return new Promise<Transform>((resolve, reject) => {
		if (formats.length < 1) {
			reject(new Error("No videoFormats available!"));
		} else {
			const dummy = dummyPipe();
			const audioFormats = ytdl.filterFormats(formats, "audioonly");

			const download = ytdl(url, {
				...cookieParams,
				quality: audioFormats.length > 0 ? "highestaudio" : "lowestvideo"
			}).on("error", err => {
				console.error(`Failed to download ${url}`);
				console.error(err);
				reject(err);
			});
			if (audioFormats.length > 0) {
				download.pipe(dummy);
				resolve(dummy);
			} else {
				streamVidToAudio(download, dummy).catch(reject);
				resolve(dummy);
			}
		}
	});
}
// 64.235.204.107	3128
