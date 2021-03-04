import { Request, Response } from "express";
import { CONFIG } from "../util/util";
import internalErrorHandler from "../util/internalErrorHandler";
import { getTokenFromCode, getUserInfoFromToken, oath2FromCredentials } from "../auth/googleOauth";
import signPayload from "../auth/signPayload";
import UserModel, { userDocFromUser } from "../../database/models/user";
import generateToken from "../auth/generateToken";
import { UserFromGoogleCredentials, UserType } from "../../types/user";

const redirectToGoogle = (req: Request, res: Response): void => {
	oath2FromCredentials(`${req.protocol}://${req.get("host")}/oauth/callback`).then(oauthClient => {
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
		getTokenFromCode(req.query.code as string).then(token => {
			getUserInfoFromToken(token).then(info => {
				signPayload(token).then(signedToken => {
					res.cookie("jwt", signedToken);
					UserModel.find({
						email: info.email,
						type: UserType.GOOGLE
					}).then(docs => {
						if (docs.length > 0) {
							generateToken(docs[0]._id).then(loginToken => {
								res.status(200).json({
									token: loginToken
								});
							}).catch(internalErrorHandler(req, res));
						} else {
							const user = new UserFromGoogleCredentials(info);
							userDocFromUser(user).save().then(doc => {
								generateToken(doc._id).then(loginToken => {
									res.status(200).json({
										token: loginToken
									});
								}).catch(internalErrorHandler(req, res));
							}).catch(internalErrorHandler(req, res));
						}
					}).catch(internalErrorHandler(req, res));
				}).catch(internalErrorHandler(req, res));
			}).catch(internalErrorHandler(req, res));
		}).catch(internalErrorHandler(req, res));
	}
};

export { redirectToGoogle, redirectFromGoogle };
