import ytdl from "ytdl-core";
import dummyPipe from "../util/dummyPipe";
import { Transform } from "stream";

export default function (url: string): Transform {
	const dummy = dummyPipe();
	ytdl(url, { quality: "highestaudio" })
		.on("error", err => {
			console.error(`Failed to download ${url}`);
			console.error(err);
		}).pipe(dummy);
	return dummy;
}
