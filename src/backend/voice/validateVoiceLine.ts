import { Song } from "../types/song";
import { VoiceLineTemplate, ConditionType, VoiceVariable } from "../types/voiceLine";
import { print } from "../util/util";

export function validateVoiceLine (template: VoiceLineTemplate, prev: Song, next: Song): boolean {
	const songs: Song[] = [prev, next];
	template.conditions.forEach(condition => {
		if (condition.condition === ConditionType.EXISTS) {
			if (!(condition.variable in songs[condition.appliesTo])) {
				print(`VoiceLine failed EXISTS condition on ${(condition.appliesTo ? "PREV" : "NEXT")} ${condition.variable}`);
				return false;
			}
		} else if (condition.condition === ConditionType.EQUALS_CONST && condition.operand) {
			if (String(songs[condition.appliesTo][condition.variable]) !== condition.operand) {
				print(`VoiceLine failed EQUALS_CONST condition on ${(condition.appliesTo ? "PREV" : "NEXT")} ${condition.variable}`);
				return false;
			}
		} else if (condition.condition === ConditionType.EQUALS_VAR && condition.operand && (condition.operand as VoiceVariable)) {
			if (prev[condition.variable] !== next[condition.operand as VoiceVariable]) {
				print(`VoiceLine failed EQUALS_VAR condition on ${condition.variable}`);
				return false;
			}
		}
	});
	return true;
}
