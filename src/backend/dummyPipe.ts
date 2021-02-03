import { Transform } from "stream";

export default function (): Transform {
	return new Transform({
		transform (chunk, encoding, callback) {
			this.push(chunk);
			callback();
		}
	});
}
