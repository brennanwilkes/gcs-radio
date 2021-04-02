import "dotenv/config";
export default {
	matchWithYoutube: (process.env.MATCH_WITH_YOUTUBE ?? "true") === "true",
	defaultAudioId: process.env.DEFAULT_AUDIO_ID,
	port: parseInt(process.env.PORT ?? "8080"),
	verbose: (process.env.VERBOSE ?? "false") === "true",
	encryptionSecret: process.env.TOKEN_SECRET,
	encryptionExpiryTime: 3600,
	databaseConnectionString: process.env.DB_CONNECTION,
	defaultApiLimit: 30
};
