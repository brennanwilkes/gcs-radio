import { v2 } from "@google-cloud/translate";

import "dotenv/config";
import { VoiceLineRender, VoiceLineRenderObj } from "../../types/voiceLine";
import { CONFIG } from "../util/util";

const translate = new v2.Translate({
	projectId: CONFIG.googleProjectId,
	keyFilename: CONFIG.googleCredentialsFile
});

// Hopefully this isn't expensive!! :0
export default (voiceLine: VoiceLineRender, source = "en"): Promise<VoiceLineRender> => {
	return new Promise<VoiceLineRender>((resolve, reject) => {
		const target = voiceLine.voice.slice(0, 2).replace("cm", "zh").replace("nb", "no");

		if (target === source) {
			resolve(voiceLine);
		} else {
			translate.translate(
				voiceLine.text,
				target
			).then(translated => {
				if (translated && translated.length > 0) {
					resolve(new VoiceLineRenderObj(
						voiceLine.voice,
						voiceLine.gender,
						translated[0],
						voiceLine.type
					));
				} else {
					reject(new Error("Invalid translation response"));
				}
			}).catch(reject);
		}
	});
};
