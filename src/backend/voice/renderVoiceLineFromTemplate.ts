import { Song } from "../../types/song";
import { Voice, VoiceGender, VoiceLineRender, VoiceLineRenderObj, VoiceLineTemplate } from "../../types/voiceLine";
import { getRandomRSS } from "./rss";

export function renderVoiceLineFromTemplate (template: VoiceLineTemplate, prev: Song, next: Song, voice: Voice = Voice.DEFAULT, gender: VoiceGender = VoiceGender.DEFAULT): Promise<VoiceLineRender> {
	return new Promise<VoiceLineRender>((resolve, reject) => {
		let text = template.text;

		text = text.replace(/\$PREV_TITLE/g, prev.title);
		text = text.replace(/\$PREV_ARTIST/g, prev.artist);
		text = text.replace(/\$PREV_ALBUM/g, prev.album);
		text = text.replace(/\$PREV_RELEASE_DATE/g, prev.releaseDate);

		text = text.replace(/\$NEXT_TITLE/g, next.title);
		text = text.replace(/\$NEXT_ARTIST/g, next.artist);
		text = text.replace(/\$NEXT_ALBUM/g, next.album);
		text = text.replace(/\$NEXT_RELEASE_DATE/g, next.releaseDate);

		if (text.includes("$RSS")) {
			getRandomRSS().then(rss => {
				text = text.replace(/\$RSS_TITLE/g, rss.name);
				text = text.replace(/\$RSS_HEADLINE/g, rss.headline);
				text = text.replace(/\$RSS_DETAILS/g, rss.details);
			}).catch(console.error).finally(() => {
				resolve(new VoiceLineRenderObj(voice, gender, text, template.type));
			});
		} else {
			resolve(new VoiceLineRenderObj(voice, gender, text, template.type));
		}
	});
}
