import { Request, Response } from "express";
import { getUserIdFromToken } from "../../auth/getUser";
import UserModel from "../../../database/models/user";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { UserFromDoc } from "../../../types/user";

export default (req: Request, res:Response): void => {
	const token = req.query.musicKitToken as string;

	getUserIdFromToken(req.headers.token as string).then(id => {
		return UserModel.findOne({
			_id: id
		});
	}).then(user => {
		if (!user) {
			return Promise.reject(new Error("Invalid user"));
		}
		user.musicKitToken = token;
		res.cookie("mkt", token, { httpOnly: false });
		return user.save();
	}).then(user => {
		const userObj = new UserFromDoc(user);
		res.status(200).json({
			users: [userObj]
		});
	}).catch(internalErrorHandler(req, res));
};
