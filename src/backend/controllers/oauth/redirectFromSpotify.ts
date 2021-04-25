import { Request, Response } from "express";
import { generateDashboardRedirect } from "../../util/util";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import connection from "../../spotify/connection";
import UserModel, { UserDoc, userDocFromUser } from "../../../database/models/user";
import { UserFromSpotifyCredentials, UserType } from "../../../types/user";
import SpotifyApi from "spotify-web-api-node";
import generateToken from "../../auth/generateToken";
import welcomeEmail from "../../email/welcomeEmail";
import { fireAndForgetMail } from "../../email/email";
import logger from "../../logging/logger";
import { getUserIdFromToken } from "../../auth/getUser";

// Handles an incoming redirect from spotify oauth
export default (req: Request, res:Response): void => {
	const code = req.query.code as string;
	let user: SpotifyApi.UserObjectPrivate | undefined;
	let spotifyRefreshToken: string | undefined;

	connection.then(spotifyApi => {
		spotifyApi.authorizationCodeGrant(code).then(data => {
			spotifyApi.setAccessToken(data.body.access_token);
			spotifyApi.setRefreshToken(data.body.refresh_token);

			// Cache spotify refresh token
			// Super important as the spotify player needs this
			// on the frontend in order to play from the spotify web api
			res.cookie("srt", data.body.refresh_token, { httpOnly: false });
			res.cookie("sat", data.body.access_token, { httpOnly: false });
			spotifyRefreshToken = data.body.refresh_token;

			return spotifyApi.getMe();
		}).then(async userResp => {
			let search = true;
			if (req.headers.token && typeof req.headers.token === "string") {
				search = false;
				const existingUserId = await getUserIdFromToken(req.headers.token);
				if (!existingUserId) {
					search = true;
				} else {
					const existingUser = await UserModel.findOne({
						_id: existingUserId
					});

					// User account already exists, and is being connected to spotify
					if (existingUser) {
						// Update user refresh token
						existingUser.spotifyRefreshToken = spotifyRefreshToken;
						return existingUser.save();
					} else {
						throw new Error("Updating existing user account failed");
					}
				}
			}
			if (search) {
				user = userResp.body;
				return UserModel.find({
					email: user.email,
					type: UserType.SPOTIFY
				});
			}
		}).then(async docs => {
			const arrDocs = Array.isArray(docs) ? docs : [docs as UserDoc];

			// Login
			if (docs && arrDocs.length > 0) {
				return generateToken(arrDocs[0]._id);
			} else {
				// Signup
				const userObj = new UserFromSpotifyCredentials(user as SpotifyApi.UserObjectPrivate, spotifyRefreshToken);
				logger.logSignup(userObj.email, UserType.SPOTIFY);
				fireAndForgetMail(welcomeEmail(userObj.email));
				const doc = await userDocFromUser(userObj).save();
				return await generateToken(doc._id);
			}
		}).then(token => {
			res.cookie("jwt", token, { httpOnly: false });
			res.redirect(generateDashboardRedirect(req));
		}).catch(internalErrorHandler(req, res));
	}).catch(internalErrorHandler(req, res));
};
