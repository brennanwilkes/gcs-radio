import { Howl } from "howler";
import { Song } from "./song";
import { VoiceLineRender } from "./voiceLine";

const iOS = (): boolean => [
	"iPad Simulator",
	"iPhone Simulator",
	"iPod Simulator",
	"iPad",
	"iPhone",
	"iPod"
].includes(navigator.platform) ||
	// iPad on iOS 13 detection
	(navigator.userAgent.includes("Mac") && "ontouchend" in document);

export default class SongHowl extends Howl {
	constructor (audio: Song | VoiceLineRender) {
		super({
			src: `/api/audio/${audio?.audioId}`,
			format: ["mp3"],
			autoplay: false,
			preload: false,
			html5: iOS()
		});
	}
}
export { iOS };
