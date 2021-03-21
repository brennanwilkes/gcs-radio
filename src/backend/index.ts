// Brennan Wilkes

import RadioServer from "./server";
import { mongoose } from "../database/connection";
import mainRouter from "./routes/index";
import generateDefaultAudio from "./controllers/generateDefaultAudioController";

const server = new RadioServer();

server.route("/", mainRouter);

if (process.env.ENABLE_GENERATE_DEFAULT_AUDIO) {
	server.app.get("/generateDefaultAudio", generateDefaultAudio(server));
}

/*

import { VoiceLineTemplateModelFromVoiceLineTemplate } from "../database/models/voiceLineTemplate";
import { ConditionAppliesTo, VoiceConditionObj, VoiceVariable, ConditionType, VoiceLineTemplateAutofill, VoiceLineType } from "../types/voiceLine";

//new VoiceLineTemplateAutofill([],"You're listening to GCS Radio. Next up we're listening to $NEXT_TITLE by $NEXT_ARTIST",VoiceLineType.normal),
//new VoiceLineTemplateAutofill([],"That was $PREV_TITLE. Here's $NEXT_TITLE.",VoiceLineType.normal),
//new VoiceLineTemplateAutofill([],"Next up on GCS Radio, $NEXT_TITLE by $NEXT_ARTIST",VoiceLineType.parallel),
//new VoiceLineTemplateAutofill([],"The best music, right here on GCS radio",VoiceLineType.parallel),
//new VoiceLineTemplateAutofill([],"$PREV_ARTIST, $NEXT_ARTIST, and all the hits on GCS Radio.",VoiceLineType.parallel),
//new VoiceLineTemplateAutofill([
//	new VoiceConditionObj(ConditionAppliesTo.PREVIOUS, VoiceVariable.title, ConditionType.EQUALS_VAR, VoiceVariable.title),
//	new VoiceConditionObj(ConditionAppliesTo.PREVIOUS, VoiceVariable.artist, ConditionType.EQUALS_VAR, VoiceVariable.artist),
//],"$NEXT_SONG by $NEXT_ARTIST is so good we have to play it again!",VoiceLineType.parallel),

const testingVoiceLines = [
	new VoiceLineTemplateAutofill([],"Welcome to GCS Radio! First up, $NEXT_TITLE by $NEXT_ARTIST",VoiceLineType.intro),
];

server.app.get("/triggerTest", (_req, res) => {
	testingVoiceLines.forEach(testingVoiceLine => {
		VoiceLineTemplateModelFromVoiceLineTemplate(testingVoiceLine).save().then(resp => {
			console.log(resp);
		}).catch(err => {
			console.error(err);
		});
	});
});
*/

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", function callback () {
	server.start();
});
