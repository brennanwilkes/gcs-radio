import { Howl } from "howler";
import { Song } from "./song";
import { VoiceLineRender } from "./voiceLine";

export default class SongHowl extends Howl {
	constructor (audio: Song | VoiceLineRender) {
		super({
			src: `/api/audio/${audio?.audioId}`,
			format: ["mp3"],
			autoplay: false,
			preload: false,
			html5: true
		});
	}
}
