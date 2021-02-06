import { Transform } from "stream";

export default function (): Transform {
	return new Transform({
		transform (chunk, _encoding, callback) {
			this.push(chunk);
			callback();
		}
	});
}
