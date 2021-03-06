import { Request, Response } from "express";
import { CONFIG } from "../util/util";
import internalErrorHandler from "../util/internalErrorHandler";
import { getTokenFromCode, getUserInfoFromToken, oath2FromCredentials } from "../auth/googleOauth";
import signPayload from "../auth/signPayload";
import UserModel, { userDocFromUser } from "../../database/models/user";
import generateToken from "../auth/generateToken";
import { UserFromGoogleCredentials, UserType } from "../../types/user";
import { GoogleCredential } from "../../types/googleCredential";

const generateRedirectURI = (req: Request) => `${req.protocol}://${req.get("host")}/auth/oauth/google`;

const redirectToGoogle = (req: Request, res: Response): void => {
	oath2FromCredentials(generateRedirectURI(req)).then(oauthClient => {
		res.redirect(oauthClient.generateAuthUrl({
			access_type: "offline",
			scope: CONFIG.googleOauth2Credentials.scope
		}));
	}).catch(internalErrorHandler(req, res));
};

const redirectFromGoogle = (req: Request, res:Response): void => {
	const code = req.query.code as string;

	let info: GoogleCredential | undefined;
	getTokenFromCode(code, generateRedirectURI(req)).then(async token => {
		res.cookie("googleJWT", await signPayload(token));
		return getUserInfoFromToken(token, generateRedirectURI(req));
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
			const doc = await userDocFromUser(user).save();
			return await generateToken(doc._id);
		}
	}).then(loginToken => {
		res.status(200).json({
			token: loginToken
		});
	}).catch(internalErrorHandler(req, res));
};

export { redirectToGoogle, redirectFromGoogle };
