import { Request, Response } from "express";
import Playlist from "../../../database/models/playlist";
import { print } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { mongoose } from "../../../database/connection";

import sendPlaylistResponse from "./sendPlaylistResponse";

export default (req: Request, res: Response): void => {
	print(`Handling request for playlist creation`);

	const songIds: string[] = req.body.songs;
	const featureIds: string[] | undefined = req.body.features;

	new Playlist({
		songs: songIds.map(id => new mongoose.Types.ObjectId(id)),
		name: req.body.name,
		user: req.body.user ? new mongoose.Types.ObjectId(req.body.user) : undefined,
		description: req.body.description,
		features: featureIds ? featureIds.map(id => new mongoose.Types.ObjectId(id)) : undefined,
		private: req.body.private ?? true
	}).save().then(resp => {
		return resp.populate({
			path: "songs",
			populate: { path: "song" }
		}).execPopulate();
	}).then(resp => {
		return resp.populate({
			path: "features",
			populate: { path: "song" }
		}).execPopulate();
	}).then(resp => {
		print(`Created playlist resource ${resp}`);
		sendPlaylistResponse([resp], req, res);
	}).catch(internalErrorHandler(req, res));
};
