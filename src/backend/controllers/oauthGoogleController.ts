import { Request, Response } from "express";
import { CONFIG } from "../util/util";
import internalErrorHandler from "../util/internalErrorHandler";
import { getTokenFromCode, getUserInfoFromToken, oath2FromCredentials } from "../auth/googleOauth";
import signPayload from "../auth/signPayload";
import UserModel, { userDocFromUser } from "../../database/models/user";
import generateToken from "../auth/generateToken";
import { UserFromGoogleCredentials, UserType } from "../../types/user";
import { GoogleCredential } from "../../types/googleCredential";

const generateRedirectURI = (req: Request) => `${req.protocol}://${req.get("host")}/auth/oauth`;

const redirectToGoogle = (req: Request, res: Response): void => {
	oath2FromCredentials(generateRedirectURI(req)).then(oauthClient => {
		res.redirect(oauthClient.generateAuthUrl({
			access_type: "offline",
			scope: CONFIG.oauth2Credentials.scope
		}));
	}).catch(internalErrorHandler(req, res));
};

const redirectFromGoogle = (req: Request, res:Response): void => {
	if (req.query.error || !req.query.code) {
		// User rejected request
		internalErrorHandler(req, res)((req.query.error ?? "Google failed to authenticate") as string);
	} else {
		let info: GoogleCredential | undefined;
		getTokenFromCode(req.query.code as string, generateRedirectURI(req)).then(async token => {
			res.cookie("jwt", await signPayload(token));
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
			} else if (info) {
				const user = new UserFromGoogleCredentials(info);
				const doc = await userDocFromUser(user).save();
				return await generateToken(doc._id);
			} else {
				return Promise.reject(new Error("Could not find user info from token"));
			}
		}).then(loginToken => {
			res.status(200).json({
				token: loginToken
			});
		}).catch(internalErrorHandler(req, res));
	}
};

export { redirectToGoogle, redirectFromGoogle };
