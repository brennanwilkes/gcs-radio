import { Request, Response } from "express";
import { SongFromInfo } from "../../database/models/song";
import streamToMongo from "../../database/streamToMongo";
import dummyPipe from "../util/dummyPipe";
import streamVidToAudio from "../util/streamVidToAudio";
import downloadURLinfo from "../youtube/downloadURLinfo";
import downloadURLToStream from "../youtube/downloadURLToStream";
import { SongInfo } from "../types/song";
import { print } from "../util/util";

const getSongs = (req: Request, res: Response) => {
	res.end();
};

const getSong = (req: Request, res: Response) => {
	res.end();
};

const postSong = async (req: Request, res: Response) => {
	print(`Handling request for audio cache id="${req.query.id}"`);

	const dummy = dummyPipe();
	const url = `https://www.youtube.com/watch?v=${String(req.query.id)}`;
	const info = await downloadURLinfo(url);

	print(`Retrieved information for "${info.track}"`);

	streamVidToAudio(downloadURLToStream(url), dummy);

	print("Created audio conversion stream");

	streamToMongo(`${info.track} - ${info.artist} - ${info.album}`, dummy).then(audioId => {
		print(`Created audio resource ${audioId}`);
		SongFromInfo(info, audioId).save().then((resp) => {
			print(`Created song resource ${resp}`);
			res.send({
				song: new SongInfo(info, audioId)
			});
			res.end();
		}).catch(error => {
			print(error);
			res.status(500).send(error);
			res.end();
		});
	}).catch(err => {
		print(err);
		res.send(err);
		res.end();
	});
};

export { getSongs, getSong, postSong };
