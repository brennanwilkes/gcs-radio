import streamFromMongo from "../../database/streamFromMongo";
import { Request, Response } from "express";
import { print } from "../util/util";
import { mongoose } from "../../database/connection";
import internalErrorHandler from "../util/internalErrorHandler";

const getAudio = async (req: Request, res: Response): Promise<void> => {
	const errorHandler = internalErrorHandler(req, res);

	print(`Handling request for audio resource ${req.params.id}`);
	res.setHeader("content-type", "audio/mpeg");
	res.setHeader("accept-ranges", "bytes");

	mongoose.connection.db.collection("audio.files", (err, collection) => {
		if (err) {
			print(`${err}`);
			errorHandler(`${err}`);
		} else {
			collection.find({ _id: mongoose.Types.ObjectId(req.params.id) }).toArray((err, audioFile) => {
				if (err) {
					print(`${err}`);
					errorHandler(`${err}`);
				} else {
					print(`Creating buffer of size ${Math.floor(audioFile[0].length / (1024 * 1024) * 100) / 100} mB`);
					res.setHeader("content-length", audioFile[0].length);

					streamFromMongo(req.params.id, res).then(() => {
						res.end();
						print(`Audio stream closed successfully`);
					}).catch(err => {
						print(err);
						errorHandler(err);
					});
				}
			});
		}
	});
};

export { getAudio };
