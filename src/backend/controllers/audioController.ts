import streamFromMongo from "../../database/streamFromMongo";
import { Request, Response } from "express";
import { print } from "../util/util";

const getAudio = async (req: Request, res: Response) => {
	print(`Handling request for audio resource ${req.params.id}`);
	res.setHeader("content-type", "audio/mpeg");
	streamFromMongo(req.params.id, res);
};

export { getAudio };
