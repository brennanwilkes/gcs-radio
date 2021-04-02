import { Request, Response } from "express";
import Playlist, { PlaylistDoc } from "../../../database/models/playlist";
import { CONFIG, print } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import notFoundErrorHandler from "../../errorHandlers/notFoundErrorHandler";
import { mongoose } from "../../../database/connection";
import { getUserIdFromToken } from "../../auth/getUser";

import sendPlaylistResponse from "./sendPlaylistResponse";

export default (req: Request, res: Response): void => {
	print(`Handling request for playlist resources`);

	const isNamed = !!req.query.isNamed;
	const noAutoGenerated = !!req.query.noAutoGenerated;
	const limit = (req.query.limit as number | undefined) ?? CONFIG.defaultApiLimit;

	let total: PlaylistDoc[] = [];
	let userId: string | undefined;
	Playlist.find({
		private: false
	}).limit(limit).then(playlistResults => {
		total = [...playlistResults];
		return new Promise<PlaylistDoc[]>((resolve, reject) => {
			getUserIdFromToken(req.header("token") ?? "INVALID").then(user => {
				userId = user;
				Playlist.find({
					user: new mongoose.Types.ObjectId(user)
				}).then(resolve).catch(reject);
			}).catch(() => {
				resolve(Promise.resolve([]));
			});
		});
	}).then(playlistResults => {
		total = [...total, ...playlistResults];
		total = total.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);

		if (isNamed) {
			total = total.filter(p => !!(p.name));
		}

		if (total && total.length) {
			if (noAutoGenerated) {
				total = total.filter(playlist => !playlist.autoGenerated);
			}
			sendPlaylistResponse(total, req, res, userId);
		} else {
			notFoundErrorHandler(req, res)("playlist");
		}
	}).catch(internalErrorHandler(req, res));
};
