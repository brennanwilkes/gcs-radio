import { Request, Response } from "express";
import { CONFIG, generateDashboardRedirect } from "../util/util";
import internalErrorHandler from "../util/internalErrorHandler";
import { getTokenFromCode, getUserInfoFromToken, oath2FromCredentials } from "../auth/googleOauth";
import signPayload from "../auth/signPayload";
import UserModel, { userDocFromUser } from "../../database/models/user";
import generateToken from "../auth/generateToken";
import { UserFromGoogleCredentials, UserType } from "../../types/user";
import { GoogleCredential } from "../../types/googleCredential";

const generateGoogleRedirectURI = (req: Request) => `${req.protocol}://${req.get("host")}/auth/oauth/google`;

const redirectToGoogle = (req: Request, res: Response): void => {
	oath2FromCredentials(generateGoogleRedirectURI(req)).then(oauthClient => {
		res.redirect(oauthClient.generateAuthUrl({
			access_type: "offline",
			scope: CONFIG.googleOauth2Credentials.scope
		}));
	}).catch(internalErrorHandler(req, res));
};

const redirectFromGoogle = async (req: Request, res:Response): Promise<void> => {
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
			const doc = await userDocFromUser(user).save();
			return await generateToken(doc._id);
		}
	}).then(loginToken => {
		res.cookie("jwt", loginToken, { httpOnly: false });
		res.redirect(generateDashboardRedirect(req));
	}).catch(internalErrorHandler(req, res));
};

export { redirectToGoogle, redirectFromGoogle };
