import { Request, Response } from "express";
import Song, { SongFromInfo } from "../../database/models/song";
import streamToMongo from "../../database/streamToMongo";
import dummyPipe from "../util/dummyPipe";
import streamVidToAudio from "../util/streamVidToAudio";
import downloadURLinfo from "../youtube/downloadURLinfo";
import downloadURLToStream from "../youtube/downloadURLToStream";
import { SongObjFromQuery } from "../types/song";
import { print } from "../util/util";
import internalErrorHandler from "../util/internalErrorHandler";
import notFoundErrorHandler from "../util/notFoundErrorHandler";
import { mongoose } from "../../database/connection";

const getSongs = (req: Request, res: Response) => {
	res.send({
		suc: "suc"
	});
	res.end();
};

const getSong = (req: Request, res: Response) => {
	Song.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) }).then(result => {
		if (result) {
			res.json({
				song: new SongObjFromQuery(result)
			});
			res.end();
		} else {
			notFoundErrorHandler(req, res)("song", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};

const postSong = async (req: Request, res: Response) => {
	print(`Handling request for audio cache id="${req.query.id}"`);

	const dummy = dummyPipe();
	const url = `https://www.youtube.com/watch?v=${String(req.query.id)}`;

	downloadURLinfo(url).then(info => {
		print(`Retrieved information for "${info.track}"`);
		streamVidToAudio(downloadURLToStream(url), dummy).catch(internalErrorHandler(req, res));

		print("Created audio conversion stream");

		streamToMongo(`${info.track} - ${info.artist} - ${info.album}`, dummy).then(audioId => {
			print(`Created audio resource ${audioId}`);
			SongFromInfo(info, audioId).save().then((resp) => {
				print(`Created song resource ${resp}`);
				res.send({
					song: new SongObjFromQuery(resp)
				});
				res.end();
			}).catch(internalErrorHandler(req, res));
		}).catch(internalErrorHandler(req, res));
	}).catch(internalErrorHandler(req, res));
};

export { getSongs, getSong, postSong };
