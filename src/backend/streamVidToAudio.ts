import ffmpegCommand from "fluent-ffmpeg";
import {Writable, Readable} from "stream";

export default function(stdin: Readable, stdout: Writable): void {
	ffmpegCommand({source: stdin})
		.toFormat('mp3')
		.on('error', function(err) {
			console.log('An error occurred: ' + err.message);
		})
		.writeToStream(stdout);
}
