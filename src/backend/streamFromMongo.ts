import {Writable} from "stream";
import {mongoose} from "../database/connection";

export default function(id:string, stdout: Writable): void{

	let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
		bucketName: 'songs'
	});

	let downloadStream = bucket.openDownloadStream(mongoose.Types.ObjectId(id));
	downloadStream.pipe(stdout);
}
