import { isEquivalentToSong, isPlayable, upgradeToPlayable, playableConverter } from "../../types/playables/playable";
import { YoutubePlayable } from "../../types/playables/youtubePlayable";
import { Song } from "../../types/song";
import { YoutubeResult } from "../../types/youtubeResult";
import { xOrMore, thresholdDistance } from "../util/util";
import { searchYoutubeDetailed, searchYoutubeSimple } from "./searchYoutube";

export class YoutubePlayableConverter implements playableConverter<YoutubePlayable, YoutubeResult> {
	isPlayable: isPlayable<YoutubePlayable> = (song: Song): song is YoutubePlayable => {
		return "youtubeId" in song;
	}

	isEquivalentToSong:isEquivalentToSong<YoutubeResult> = (song: Song, data: YoutubeResult) => {
		return xOrMore([
			thresholdDistance(song.title, data.title) || thresholdDistance(song.title, data.youtubeTitle),
			thresholdDistance(song.artist, data.artist) || thresholdDistance(song.artist, data.youtubeArtist),
			thresholdDistance(song.album, data.album)
		]) && Math.abs(song.duration - data.duration) <= song.duration * 0.1;
	}

	upgradeToPlayable: upgradeToPlayable<YoutubePlayable> = (base: Song): Promise<YoutubePlayable> => {
		return new Promise<YoutubePlayable>((resolve, reject) => {
			searchYoutubeSimple(`song ${base.title} by ${base.artist} official`).then(async youtubeIds => {
				for (let i = 0; i < youtubeIds.length; i++) {
					const youtubeDetails = await searchYoutubeDetailed(youtubeIds[i]).catch(reject);

					if (youtubeDetails && this.isEquivalentToSong(base, youtubeDetails)) {
						base.youtubeId = youtubeIds[i];
						return Promise.resolve(base as YoutubePlayable);
					}
				}
				return Promise.reject(new Error("No Youtube matches were found"));
			}).then(resolve).catch(reject);
		});
	}

	directUpgradeToPlayable: (song: Song, youtubeId: string) => YoutubePlayable = (song: Song, youtubeId: string) => {
		song.youtubeId = youtubeId;
		return song as YoutubePlayable;
	}
}

export default new YoutubePlayableConverter();
