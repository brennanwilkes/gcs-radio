import ytdl from "ytdl-core";
import dummyPipe from "../util/dummyPipe";
import { Transform } from "stream";
// import HttpsProxyAgent from "https-proxy-agent";

// const proxy = "http://64.235.204.107:3128";
// const agent = HttpsProxyAgent(proxy);

export default function (url: string): Transform {
	const dummy = dummyPipe();
	ytdl(url, {
		quality: "highestaudio"
		//		requestOptions: { agent }
	})
		.on("error", err => {
			console.error(`Failed to download ${url}`);
			console.error(err);
		}).pipe(dummy);
	return dummy;
}
// 64.235.204.107	3128
