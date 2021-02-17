import { Readable } from "stream";
import { mongoose } from "./connection";

export default function (name:string, stdin: Readable): Promise<string> {
	const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
		bucketName: "audio",
		chunkSizeBytes: Math.pow(2, 20) * 8
	});

	const uploadStream = bucket.openUploadStream(name);

	stdin.pipe(uploadStream);

	return new Promise((resolve, reject) => {
		uploadStream.on("error", (err) => {
			reject(err);
		});
		uploadStream.on("finish", () => {
			resolve(`${uploadStream.id}`);
		});
	});
}
