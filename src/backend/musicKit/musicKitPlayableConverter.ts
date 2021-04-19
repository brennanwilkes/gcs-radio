import { isEquivalentToSong, isPlayable, upgradeToPlayable, playableConverter } from "../../types/playables/playable";
import { MusicKitPlayable } from "../../types/playables/musicKitPlayable";
import { Song } from "../../types/song";
import { MusicKitResult } from "../../types/musicKitResult";
import { xOrMore, thresholdDistance, titleSanitizer } from "../util/util";
import { determinedSearchMusicKit } from "./searchMusicKit";

export class MusicKitPlayableConverter implements playableConverter<MusicKitPlayable, MusicKitResult> {
	isPlayable: isPlayable<MusicKitPlayable> = (song: Song): song is MusicKitPlayable => {
		return "musicKitId" in song;
	}

	isEquivalentToSong:isEquivalentToSong<MusicKitResult> = (song: Song, data: MusicKitResult) => {
		return xOrMore([
			thresholdDistance(song.title, data.title),
			thresholdDistance(song.artist, data.artist),
			thresholdDistance(song.album, data.album)
		]) && Math.abs(song.duration - data.duration) <= song.duration * 0.1;
	}

	upgradeToPlayable: upgradeToPlayable<MusicKitPlayable> = (base: Song): Promise<MusicKitPlayable> => {
		return new Promise<MusicKitPlayable>((resolve, reject) => {
			determinedSearchMusicKit(titleSanitizer(base.title)).then(results => {
				for (let i = 0; i < results.length; i++) {
					if (this.isEquivalentToSong(base, results[i])) {
						base.musicKitId = results[i].musicKitId;
						return Promise.resolve(base as MusicKitPlayable);
					}
				}
				return Promise.reject(new Error("No MusicKit matches were found"));
			}).then(resolve).catch(reject);
		});
	}

	directUpgradeToPlayable: (song: Song, musicKitId: string) => MusicKitPlayable = (song: Song, musicKitId: string) => {
		song.musicKitId = musicKitId;
		return song as MusicKitPlayable;
	}
}

export default new MusicKitPlayableConverter();
