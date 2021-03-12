import { Request, Response } from "express";
import { CONFIG, generateDashboardRedirect } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import connection from "../spotify/connection";
import UserModel, { userDocFromUser } from "../../database/models/user";
import { UserFromSpotifyCredentials, UserType } from "../../types/user";
import SpotifyApi from "spotify-web-api-node";
import generateToken from "../auth/generateToken";
import welcomeEmail from "../email/welcomeEmail";
import { fireAndForgetMail } from "../email/email";

const generateSpotifyRedirectURI = (req: Request): string => `${req.protocol}://${req.get("host")}/auth/oauth/spotify`;
export { generateSpotifyRedirectURI };

const redirectToSpotify = (req: Request, res: Response): void => {
	if (!process.env.SPOTIFY_ID) {
		internalErrorHandler(req, res)("Spotify application ID not set");
	} else {
		connection.then(spotifyApi => {
			spotifyApi.setRedirectURI(generateSpotifyRedirectURI(req));
			res.redirect(spotifyApi.createAuthorizeURL(CONFIG.spotifyOauth2Credentials.scope, ""));
		}).catch(internalErrorHandler(req, res));
	}
};

const redirectFromSpotify = (req: Request, res:Response): void => {
	const code = req.query.code as string;
	let user: SpotifyApi.UserObjectPrivate | undefined;

	connection.then(spotifyApi => {
		spotifyApi.authorizationCodeGrant(code).then(data => {
			spotifyApi.setAccessToken(data.body.access_token);
			spotifyApi.setRefreshToken(data.body.refresh_token);
			res.cookie("sat", data.body.access_token, { httpOnly: false });
			res.cookie("srt", data.body.refresh_token, { httpOnly: false });

			return spotifyApi.getMe();
		}).then(userResp => {
			user = userResp.body;
			return UserModel.find({
				email: user.email,
				type: UserType.SPOTIFY
			});
		}).then(async docs => {
			if (docs.length > 0) {
				return generateToken(docs[0]._id);
			} else {
				const userObj = new UserFromSpotifyCredentials(user as SpotifyApi.UserObjectPrivate);
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

export { redirectToSpotify, redirectFromSpotify };
