import "dotenv/config";
export default {
	oauth2: {
		scope: ["user-read-private", "user-read-email", "streaming"]
	},
	credentials: {
		spotifyClientId: process.env.SPOTIFY_ID,
		spotifyClientSecret: process.env.SPOTIFY_SECRET
	}
};
