import { isEquivalentToSong, isPlayable, upgradeToPlayable, playableConverter } from "../../types/playables/playable";
import { MusicKitPlayable } from "../../types/playables/musicKitPlayable";
import { Song } from "../../types/song";
import { MusicKitResult } from "../../types/musicKitResult";
import { xOrMore, thresholdDistance } from "../util/util";
import { determinedSearchMusicKitBySong } from "./searchMusicKit";

export class MusicKitPlayableConverter implements playableConverter<MusicKitPlayable, MusicKitResult> {
	isPlayable: isPlayable<MusicKitPlayable> = (song: Song): song is MusicKitPlayable => {
		return "musicKitId" in song;
	}

	isEquivalentToSong:isEquivalentToSong<MusicKitResult> = (song: Song, data: MusicKitResult) => {
		return xOrMore([
			thresholdDistance(song.title, data.title, 2),
			thresholdDistance(song.artist, data.artist, 2),
			thresholdDistance(song.album, data.album, 2)
		], 2) && Math.abs(song.duration - data.duration) <= song.duration * 0.1;
	}

	upgradeToPlayable: upgradeToPlayable<MusicKitPlayable> = (base: Song): Promise<MusicKitPlayable> => {
		return new Promise<MusicKitPlayable>((resolve, reject) => {
			determinedSearchMusicKitBySong(base).then(results => {
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
