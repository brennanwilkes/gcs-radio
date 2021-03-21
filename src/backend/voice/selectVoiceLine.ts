import { Song } from "../../types/song";
import { validateVoiceLine } from "../voice/validateVoiceLine";
import { VoiceLineTemplate, VoiceLineTemplateObjFromQuery } from "../../types/voiceLine";
import VoiceLineTemplateModel, { VoiceLineTemplateDoc } from "../../database/models/voiceLineTemplate";
import { CONFIG, print } from "../util/util";

export default async function (prev: Song, next: Song, spotifyOverride = false): Promise<VoiceLineTemplate> {
	let template: VoiceLineTemplate | undefined;
	let templateQuery: VoiceLineTemplateDoc[] | void;

	const type = (CONFIG.matchWithYoutube || spotifyOverride) ? { $match: { type: { $ne: "INTRO" } } } : { $match: { type: "NORMAL" } };

	do {
		print("Querying database for template");
		templateQuery = await VoiceLineTemplateModel.aggregate([
			type,
			{ $sample: { size: 1 } }
		]);
		if (templateQuery) {
			template = new VoiceLineTemplateObjFromQuery(templateQuery[0]);
		}
	}
	while (!template || !validateVoiceLine(template, prev, next));

	print("Found valid template");
	return template;
}

export async function selectFirstVoiceLine (): Promise<VoiceLineTemplate> {
	print("Querying database for intro template");

	const templateQuery: VoiceLineTemplateDoc[] = await VoiceLineTemplateModel.aggregate([
		{ $match: { type: "INTRO" } },
		{ $sample: { size: 1 } }
	]);
	const template: VoiceLineTemplate = new VoiceLineTemplateObjFromQuery(templateQuery[0]);

	print("Found valid template");
	return template;
}
