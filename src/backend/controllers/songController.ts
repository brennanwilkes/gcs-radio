import { Request, Response } from "express";
import { SongFromInfo } from "../../database/models/song";
import streamToMongo from "../../database/streamToMongo";
import dummyPipe from "../util/dummyPipe";
import streamVidToAudio from "../util/streamVidToAudio";
import downloadURLinfo from "../youtube/downloadURLinfo";
import downloadURLToStream from "../youtube/downloadURLToStream";
import { SongInfo } from "../types/song";

const getSongs = (req: Request, res: Response) => {
	res.end();
};

const getSong = (req: Request, res: Response) => {
	res.end();
};

const postSong = async (req: Request, res: Response) => {
	const dummy = dummyPipe();
	const url = `https://www.youtube.com/watch?v=${String(req.query.id)}`;
	const info = await downloadURLinfo(url);

	streamVidToAudio(downloadURLToStream(url), dummy);
	streamToMongo(`${info.track} - ${info.artist} - ${info.album}`, dummy).then(audioId => {
		SongFromInfo(info, audioId).save().then(() => {
			res.send({
				song: new SongInfo(info, audioId)
			});
			res.end();
		}).catch(error => {
			res.status(500).send(error);
			res.end();
		});
	}).catch(err => {
		console.error(err);
		res.send(err);
		res.end();
	});
};

export { getSongs, getSong, postSong };
