import streamFromMongo from "../../database/streamFromMongo";
import { Request, Response } from "express";

const getAudio = async (req: Request, res: Response) => {
	res.setHeader("content-type", "audio/mpeg");
	streamFromMongo(req.params.id, res);
};

export { getAudio };
