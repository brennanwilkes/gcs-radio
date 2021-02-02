import {Readable} from "stream";

import {mongoose} from "../database/connection";

export default function(name:string, stdin: Readable): Promise<string>{

	let bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
		bucketName: 'songs'
	});

	let uploadStream = bucket.openUploadStream(name);
	let id = uploadStream.id;

	stdin.pipe(uploadStream);

	return new Promise((resolve, reject) => {
		uploadStream.on('error', () => {
			reject();
		});
		uploadStream.on('finish', () => {
			resolve(`${id}`);
		});
	});
}
