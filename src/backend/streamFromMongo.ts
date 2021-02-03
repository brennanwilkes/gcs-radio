import { Writable } from "stream";
import { mongoose } from "../database/connection";

export default function (id:string, stdout: Writable): void {
	const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
		bucketName: "songs"
	});

	const downloadStream = bucket.openDownloadStream(mongoose.Types.ObjectId(id));
	downloadStream.pipe(stdout);
}
