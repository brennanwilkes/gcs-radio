import ffmpegCommand from "fluent-ffmpeg";
import { Writable, Readable } from "stream";

export default function (stdin: Readable, stdout: Writable): Promise<void> {
	return new Promise((resolve, reject) => {
		ffmpegCommand({ source: stdin })
			.toFormat("mp3")
			.on("error", (err) => {
				reject(err);
			})
			.writeToStream(stdout);
	});
}
