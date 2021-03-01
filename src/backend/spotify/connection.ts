import "dotenv/config";
import SpotifyWebApi from "spotify-web-api-node";
import { print } from "../util/util";

export default new Promise<SpotifyWebApi>((resolve, reject) => {
	const clientId = process.env.SPOTIFY_ID;
	const clientSecret = process.env.SPOTIFY_SECRET;
	if (!clientId || !clientSecret) {
		print("No spotify credentials detected");
		reject(new Error("No spotify credentials detected"));
	} else {
		// Create the api object with the credentials
		const spotifyApi = new SpotifyWebApi({
			clientId: clientId,
			clientSecret: clientSecret
		});

		// Retrieve an access token.
		spotifyApi.clientCredentialsGrant().then(data => {
			print("Granted spotify access token");

			// Save the access token so that it's used in future calls
			spotifyApi.setAccessToken(data.body.access_token);
			resolve(spotifyApi);
		}, err => {
			print("Something went wrong when retrieving an access token", err);
			reject(new Error(err));
		});
	}
});
