import "dotenv/config";
export default {
	oauth2: {
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		token_uri: "https://oauth2.googleapis.com/token",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
		scope: ["email", "profile", "openid"]
	},
	credentials: {
		googleProjectId: process.env.GOOGLE_PROJECT,
		googleClientId: process.env.GOOGLE_CLIENT_ID,
		googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
		googleCredentialsFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
		youtubeCookie: process.env.YTDL_COOKIE
	}
};
