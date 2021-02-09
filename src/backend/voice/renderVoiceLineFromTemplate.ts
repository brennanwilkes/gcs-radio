import { Song } from "../types/song";
import { Voice, VoiceGender, VoiceLineRender, VoiceLineRenderObj, VoiceLineTemplate } from "../types/voiceLine";

export function renderVoiceLineFromTemplate (template: VoiceLineTemplate, prev: Song, next: Song, voice: Voice = Voice.DEFAULT, gender: VoiceGender = VoiceGender.DEFAULT): VoiceLineRender {
	const text = template.text;

	// REPLACE vars with rendered text

	return new VoiceLineRenderObj(voice, gender, text, template.type);
}
