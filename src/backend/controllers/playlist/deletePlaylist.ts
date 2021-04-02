import { Request, Response } from "express";
import { findById as findPlaylistById } from "../../../database/models/playlist";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import notFoundErrorHandler from "../../errorHandlers/notFoundErrorHandler";
import accessDeniedErrorHandler from "../../errorHandlers/accessDeniedErrorHandler";
import { getUserIdFromToken } from "../../auth/getUser";

export default (req: Request, res: Response): void => {
	const id: string = req.params.id;

	getUserIdFromToken(req.header("token") ?? "INVALID").then(userId => {
		findPlaylistById(id, userId).then(playlist => {
			if (playlist) {
				playlist.delete().then(() => {
					res.status(200).json({});
				}).catch(internalErrorHandler(req, res));
			} else {
				notFoundErrorHandler(req, res)("playlist", id);
			}
		}).catch(internalErrorHandler(req, res));
	}).catch(() => {
		accessDeniedErrorHandler(req, res)(id);
	});
};
