// Brennan Wilkes

import RadioServer from "./server";
import { mongoose } from "../database/connection";
import mainRouter from "./routes/index";
import { VoiceLineTemplateModelFromVoiceLineTemplate } from "../database/models/voiceLineTemplate";
import { ConditionAppliesTo, VoiceConditionObj, VoiceLineTemplateObj, VoiceVariable, ConditionType } from "./types/voiceLine";

const server = new RadioServer();

server.route("/", mainRouter);

const testingVoiceLine = new VoiceLineTemplateObj(
	[
		new VoiceConditionObj(ConditionAppliesTo.NEXT, VoiceVariable.title, ConditionType.EXISTS),
		new VoiceConditionObj(ConditionAppliesTo.NEXT, VoiceVariable.artist, ConditionType.EXISTS)
	],
	"Next up on GCS Radio, $NEXT_TITLE by $NEXT_ARTIST"
);

server.app.get("/triggerTest", (_req, res) => {
	VoiceLineTemplateModelFromVoiceLineTemplate(testingVoiceLine).save().then(resp => {
		res.send(resp).end();
	}).catch(err => {
		res.send(err).end();
	});
});

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", function callback () {
	server.start();
});
