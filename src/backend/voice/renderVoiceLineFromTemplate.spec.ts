import { SongObj } from "../../types/song";
import { Voice, VoiceGender, VoiceLineTemplateAutofill, VoiceLineType } from "../../types/voiceLine";
import {renderVoiceLineFromTemplate} from "./renderVoiceLineFromTemplate";


const template = new VoiceLineTemplateAutofill([], "$NEXT_TITLE $PREV_TITLE $NEXT_ARTIST $NEXT_ALBUM $PREV_ARTIST $PREV_ALBUM $PREV_RELEASE_DATE $NEXT_RELEASE_DATE",VoiceLineType.normal);


const song1 = new SongObj(
	"title",
	"artist",
	"album",
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
	"album2",
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

test("All variables are rendered", async () => {
	const render = await renderVoiceLineFromTemplate(template, song1, song2);
	expect(render.text).toBe("title2 title artist2 album2 artist album date date");
	expect(render.gender).toBe(VoiceGender.DEFAULT);
	expect(render.voice).toBe(Voice.DEFAULT);

	const render2 = await renderVoiceLineFromTemplate(template, song1, song2, Voice.enAuB, VoiceGender.FEMALE);
	expect(render2.gender).toBe(VoiceGender.FEMALE);
	expect(render2.voice).toBe(Voice.enAuB);
});
