import { validateVoiceLine } from "./validateVoiceLine";
import { ConditionType, VoiceVariable, VoiceLineTemplateAutofill, VoiceLineType, VoiceConditionObj } from "../../types/voiceLine";
import { Song, SongObj } from "../../types/song";

const song1 = new SongObj(
	"title",
	"artist",
	"albumn",
	10,
	false,
	"ID",
	"ID",
	"ID",
	"ID",
	[],
	"URL",
	"date",
)

const song2 = new SongObj(
	"title2",
	"artist2",
	"albumn2",
	10,
	false,
	"ID",
	"ID",
	"ID",
	"ID",
	[],
	"URL",
	"date",
)

const song3 = {} as Song;

const regular = new VoiceLineTemplateAutofill([], "$NEXT_TITLE $PREV_TITLE",VoiceLineType.normal);
const titlesMatch = new VoiceLineTemplateAutofill([
	new VoiceConditionObj(0,VoiceVariable.title, ConditionType.EQUALS_VAR, VoiceVariable.title)
], "$NEXT_TITLE $PREV_TITLE",VoiceLineType.normal);
const titleIsTitle2 = new VoiceLineTemplateAutofill([
	new VoiceConditionObj(0,VoiceVariable.title, ConditionType.EQUALS_CONST, "title2"),
	new VoiceConditionObj(1,VoiceVariable.title, ConditionType.EQUALS_CONST, "title2")
], "$NEXT_TITLE $PREV_TITLE",VoiceLineType.normal);

test("Regular validity", () => {
	expect(validateVoiceLine(regular, song1, song2)).toBeTruthy();
	expect(validateVoiceLine(regular, song3, song3)).toBeFalsy();
});

test("EQUALS VAR", () => {
	expect(validateVoiceLine(titlesMatch, song1, song1)).toBeTruthy();
	expect(validateVoiceLine(titlesMatch, song1, song2)).toBeFalsy();
});

test("EQUALS CONST", () => {
	expect(validateVoiceLine(titleIsTitle2, song2, song2)).toBeTruthy();
	expect(validateVoiceLine(titleIsTitle2, song1, song1)).toBeFalsy();
});
