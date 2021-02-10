import { Song } from "../types/song";
import { validateVoiceLine } from "../voice/validateVoiceLine";
import { VoiceLineTemplate, VoiceLineTemplateObjFromQuery } from "../types/voiceLine";
import VoiceLineTemplateModel, { VoiceLineTemplateDoc } from "../../database/models/voiceLineTemplate";

export default async function (prev: Song, next: Song): Promise<VoiceLineTemplate> {
	let template: VoiceLineTemplate | undefined;
	let templateQuery: VoiceLineTemplateDoc[] | void;
	do {
		// Pull template from database
		templateQuery = await VoiceLineTemplateModel.aggregate([{ $sample: { size: 1 } }]);
		if (templateQuery) {
			template = new VoiceLineTemplateObjFromQuery(templateQuery[0]);
		}
	}
	while (!template || !validateVoiceLine(template, prev, next));
	return template;
	/*
	VoiceLineTemplateModelFromVoiceLineTemplate(testingVoiceLine).save().then(res => {
		console.dir(res);
	}).catch(err => {
		console.error(err);
	});
	*/
}
