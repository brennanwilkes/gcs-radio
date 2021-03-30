import { Playlist } from "../../types/playlist";
import { Song } from "../../types/song";
import { VoiceLineTemplate, ConditionType, VoiceVariable } from "../../types/voiceLine";
import { print } from "../util/util";

export function validateVoiceLine (template: VoiceLineTemplate, prev: Song, next: Song, playlist?: Playlist): boolean {
	const songs: Song[] = [prev, next];
	let isValid = true;

	template.conditions.forEach(condition => {
		if (condition.variable === VoiceVariable.playlist || condition.operand === VoiceVariable.playlist) {
			if (!playlist || !playlist.details) {
				print(`VoiceLine failed EXISTS condition on playlist`);
				isValid = false;
			}
		} else if (condition.condition === ConditionType.EXISTS) {
			if (!(condition.variable in songs[condition.appliesTo])) {
				print(`VoiceLine failed EXISTS condition on ${(condition.appliesTo ? "PREV" : "NEXT")} ${condition.variable}`);
				isValid = false;
			}
		} else if (condition.condition === ConditionType.EQUALS_CONST && condition.operand) {
			if (String(songs[condition.appliesTo][condition.variable]) !== condition.operand) {
				print(`VoiceLine failed EQUALS_CONST condition on ${(condition.appliesTo ? "PREV" : "NEXT")} ${condition.variable}`);
				isValid = false;
			}
		} else if (condition.condition === ConditionType.EQUALS_VAR && condition.operand && (condition.operand as Exclude<VoiceVariable, VoiceVariable.playlist>)) {
			if (prev[condition.variable] !== next[condition.operand as Exclude<VoiceVariable, VoiceVariable.playlist>]) {
				print(`VoiceLine failed EQUALS_VAR condition on ${condition.variable}`);
				isValid = false;
			}
		}
	});
	return isValid;
}
