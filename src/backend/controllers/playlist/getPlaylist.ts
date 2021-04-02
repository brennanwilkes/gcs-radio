import { Request, Response } from "express";
import { findById as findPlaylistById } from "../../../database/models/playlist";
import { print } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import notFoundErrorHandler from "../../errorHandlers/notFoundErrorHandler";
import accessDeniedErrorHandler from "../../errorHandlers/accessDeniedErrorHandler";
import { getUserIdFromToken } from "../../auth/getUser";

import sendPlaylistResponse from "./sendPlaylistResponse";

export default (req: Request, res: Response): void => {
	print(`Handling request for playlist resource ${req.params.id}`);
	findPlaylistById(req.params.id).then(playlistResults => {
		if (playlistResults) {
			getUserIdFromToken(req.header("token") ?? "INVALID").then(user => {
				if (!playlistResults.private || user === String(playlistResults.user)) {
					sendPlaylistResponse([playlistResults], req, res, user);
				} else {
					accessDeniedErrorHandler(req, res)(playlistResults._id);
				}
			}).catch(() => {
				if (playlistResults.private) {
					accessDeniedErrorHandler(req, res)(playlistResults._id);
				} else {
					sendPlaylistResponse([playlistResults], req, res);
				}
			});
		} else {
			notFoundErrorHandler(req, res)("playlist", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};
