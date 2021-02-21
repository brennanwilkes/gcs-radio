import youtubedl from "youtube-dl";
import dummyPipe from "../util/dummyPipe";
import { Transform } from "stream";

export default function (url: string): Transform {
	const dummy = dummyPipe();
	youtubedl(url, ["--extract-audio", "--format=bestaudio"], { cwd: __dirname }).pipe(dummy);
	return dummy;
}
