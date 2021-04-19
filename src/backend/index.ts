// Brennan Wilkes

import RadioServer from "./server";
import { mongoose } from "../database/connection";
import mainRouter from "./routes/index";
import generateDefaultAudio from "./controllers/dev/generateDefaultAudioController";
import generateVoiceTemplates from "./controllers/dev/generateVoiceTemplatesController";
import logger from "./logging/logger";
import searchMusicKit from "./musicKit/searchMusicKit";

const server = new RadioServer();

server.route("/", mainRouter);

if (process.env.ENABLE_GENERATE_DEFAULT_AUDIO) {
	server.app.get("/generateDefaultAudio", generateDefaultAudio(server));
}
if (process.env.ENABLE_GENERATE_TEMPLATES) {
	server.app.get("/generateTemplates", generateVoiceTemplates(server));
}

server.app.get("/test", (req, res) => {
	searchMusicKit(`Next Year RAC remix`).then(data => {
		res.send(data);
	}).catch(res.send);
});

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", function callback () {
	logger.logDBConnection();
	server.start();
});
