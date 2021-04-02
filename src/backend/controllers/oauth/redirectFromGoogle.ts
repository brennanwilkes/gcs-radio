import { Request, Response } from "express";
import { generateDashboardRedirect } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { getTokenFromCode, getUserInfoFromToken } from "../../auth/googleOauth";
import signPayload from "../../auth/signPayload";
import UserModel, { userDocFromUser } from "../../../database/models/user";
import generateToken from "../../auth/generateToken";
import { UserFromGoogleCredentials, UserType } from "../../../types/user";
import { GoogleCredential } from "../../../types/googleCredential";
import welcomeEmail from "../../email/welcomeEmail";
import { fireAndForgetMail } from "../../email/email";
import logger from "../../logging/logger";

import generateGoogleRedirectURI from "./generateGoogleRedirectURI";

export default async (req: Request, res:Response): Promise<void> => {
	const code = req.query.code as string;

	let info: GoogleCredential | undefined;
	getTokenFromCode(code, generateGoogleRedirectURI(req)).then(async token => {
		res.cookie("googleJWT", await signPayload(token));
		return getUserInfoFromToken(token, generateGoogleRedirectURI(req));
	}).then(userInfo => {
		info = userInfo;
		return UserModel.find({
			email: userInfo.email,
			type: UserType.GOOGLE
		});
	}).then(async docs => {
		if (docs.length > 0) {
			return generateToken(docs[0]._id);
		} else {
			const user = new UserFromGoogleCredentials(info as GoogleCredential);

			logger.logSignup(user.email, UserType.GOOGLE);
			fireAndForgetMail(welcomeEmail(user.email));
			const doc = await userDocFromUser(user).save();
			return await generateToken(doc._id);
		}
	}).then(loginToken => {
		res.cookie("jwt", loginToken, { httpOnly: false });
		res.redirect(generateDashboardRedirect(req));
	}).catch(internalErrorHandler(req, res));
};
