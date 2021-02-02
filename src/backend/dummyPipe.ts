import {Transform} from "stream";

export default function(){
	return new Transform({
		transform(chunk, encoding, callback){
			this.push(chunk);
			callback();
		}
	})
}
