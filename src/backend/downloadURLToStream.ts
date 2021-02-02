import youtubedl from "youtube-dl";
import dummyPipe from "./dummyPipe";
import {Transform} from "stream";

export default function(url: string): Transform {
	const dummy = dummyPipe();
	youtubedl(url, ['--format=18'], { cwd: __dirname }).pipe(dummy);
	return dummy;
}
