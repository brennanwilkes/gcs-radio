import { Song } from "../types/song";
import { VoiceLineTemplate } from "../types/voiceLine";

export function validateVoiceLine (template: VoiceLineTemplate, prev: Song, next: Song): boolean {
	template.conditions.forEach(condition => {
		// Evaluate if condition is true

	});
	return true;
}
