import "dotenv/config";
export default {
	oauth2: {
		scope: ["user-read-private", "user-read-email", "streaming"]// "playlist-read-private", "user-top-read"]
	},
	credentials: {
		spotifyClientId: process.env.SPOTIFY_ID,
		spotifyClientSecret: process.env.SPOTIFY_SECRET
	}
};
