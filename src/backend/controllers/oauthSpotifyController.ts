import { Request, Response } from "express";
import { CONFIG } from "../util/util";
import internalErrorHandler from "../util/internalErrorHandler";
import signPayload from "../auth/signPayload";
import connection from "../spotify/connection";
import UserModel, { userDocFromUser } from "../../database/models/user";
import { UserFromSpotifyCredentials, UserType } from "../../types/user";
import SpotifyApi from "spotify-web-api-node";
import generateToken from "../auth/generateToken";

const generateRedirectURI = (req: Request) => `${req.protocol}://${req.get("host")}/auth/oauth`;

const redirectToSpotify = (req: Request, res: Response): void => {
	if (!process.env.SPOTIFY_ID) {
		internalErrorHandler(req, res)("Spotify application ID not set");
	} else {
		connection.then(spotifyApi => {
			spotifyApi.setRedirectURI(generateRedirectURI(req));
			res.redirect(spotifyApi.createAuthorizeURL(CONFIG.spotifyOauth2Credentials.scope, ""));
		}).catch(internalErrorHandler(req, res));
	}
};

const redirectFromSpotify = (req: Request, res:Response): void => {
	const code = req.query.code as string;
	let user: SpotifyApi.UserObjectPrivate | undefined;
	let token: string | undefined;

	connection.then(spotifyApi => {
		spotifyApi.authorizationCodeGrant(code).then(data => {
			spotifyApi.setAccessToken(data.body.access_token);
			spotifyApi.setRefreshToken(data.body.refresh_token);

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
				const doc = await userDocFromUser(userObj).save();
				return await generateToken(doc._id);
			}
		}).then(loginToken => {
			token = loginToken;
			return signPayload(code);
		}).then(signed => {
			res.cookie("spotifyJWT", signed);
			res.status(200).json({
				token: token as string
			});
		}).catch(internalErrorHandler(req, res));
	}).catch(internalErrorHandler(req, res));
};

export { redirectToSpotify, redirectFromSpotify };
