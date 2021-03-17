import "dotenv/config";
export default {
	port: parseInt(process.env.PORT ?? "8080"),
	verbose: !!(process.env.VERBOSE ?? false),
	encryptionSecret: process.env.TOKEN_SECRET,
	encryptionExpiryTime: 3600,
	databaseConnectionString: process.env.DB_CONNECTION
};
