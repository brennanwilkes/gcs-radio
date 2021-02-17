// Brennan Wilkes

import RadioServer from "./server";
import { mongoose } from "../database/connection";
import mainRouter from "./routes/index";

const server = new RadioServer();

server.route("/", mainRouter);

/*

import { VoiceLineTemplateModelFromVoiceLineTemplate } from "../database/models/voiceLineTemplate";
import { ConditionAppliesTo, VoiceConditionObj, VoiceLineTemplateObj, VoiceVariable, ConditionType } from "../types/voiceLine";

const testingVoiceLine = new VoiceLineTemplateObj(
	[
		new VoiceConditionObj(ConditionAppliesTo.NEXT, VoiceVariable.title, ConditionType.EXISTS),
		new VoiceConditionObj(ConditionAppliesTo.NEXT, VoiceVariable.artist, ConditionType.EXISTS),
		new VoiceConditionObj(ConditionAppliesTo.PREVIOUS, VoiceVariable.title, ConditionType.EXISTS),
		new VoiceConditionObj(ConditionAppliesTo.PREVIOUS, VoiceVariable.title, ConditionType.EQUALS_VAR, VoiceVariable.title)
	],
	"So good we're going to play it again! It's $NEXT_TITLE by $NEXT_ARTIST"
);

server.app.get("/triggerTest", (_req, res) => {
	VoiceLineTemplateModelFromVoiceLineTemplate(testingVoiceLine).save().then(resp => {
		res.send(resp).end();
	}).catch(err => {
		res.send(err).end();
	});
});
*/

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", function callback () {
	server.start();
});
