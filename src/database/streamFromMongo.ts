import { Writable } from "stream";
import { mongoose } from "./connection";

export default function async (id:string, stdout: Writable): Promise<void> {
	return new Promise((resolve, reject) => {
		const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
			bucketName: "audio",
			chunkSizeBytes: Math.pow(2, 20) * 8
		});

		const bufs: Uint8Array[] = [];
		bucket.openDownloadStream(mongoose.Types.ObjectId(id))
			.on("error", err => {
				reject(err);
			}).on("data", data => {
				bufs.push(data);
			}).on("end", () => {
				stdout.write(Buffer.concat(bufs), "binary");
				resolve();
			});
	});
}
