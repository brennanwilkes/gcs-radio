import { Request, Response } from "express";
import User from "../../../database/models/user";
import notFoundErrorHandler from "../../errorHandlers/notFoundErrorHandler";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { getUserFromToken } from "../../auth/getUser";

export default (req: Request, res: Response): void => {
	const id = String(req.params.id);
	getUserFromToken(id as string).then((user) => {
		User.findById(user.id).then(userDoc => {
			if (userDoc) {
				userDoc.verifiedEmail = true;
				userDoc.save().then(() => {
					res.redirect("../login?verified=1");
				}).catch(internalErrorHandler(req, res));
			} else {
				notFoundErrorHandler(req, res)("user", user.id);
			}
		}).catch(() => notFoundErrorHandler(req, res)("user", user.id));
	}).catch(internalErrorHandler(req, res));
};
