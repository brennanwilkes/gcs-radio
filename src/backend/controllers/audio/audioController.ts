import streamFromMongo from "../../../database/streamFromMongo";
import { Request, Response } from "express";
import { CONFIG, print } from "../../util/util";
import { mongoose } from "../../../database/connection";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";

const getAudio = async (req: Request, res: Response): Promise<void> => {
	const errorHandler = internalErrorHandler(req, res);

	const id: string = req.params.id;
	const isDefault = CONFIG.defaultAudioId && id === CONFIG.defaultAudioId;

	print(`Handling request for audio resource ${id}`);
	res.setHeader("content-type", "audio/mpeg");
	res.setHeader("accept-ranges", "bytes");

	// Get the audio bucket collection
	mongoose.connection.db.collection(isDefault ? "defaultAudio.files" : "audio.files", (err, collection) => {
		if (err) {
			print(`${err}`);
			errorHandler(`${err}`);
		} else {
			// Find within the correct bucket resource
			collection.find({ _id: mongoose.Types.ObjectId(id) }).toArray((err, audioFile) => {
				if (err) {
					print(`${err}`);
					errorHandler(`${err}`);
				} else {
					print(`Streaming audio resource of size ${Math.floor(audioFile[0].length / (1024 * 1024) * 100) / 100} mB`);

					res.setHeader("content-length", audioFile[0].length);
					streamFromMongo(id, res, isDefault ? "defaultAudio" : "audio").then(() => {
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
