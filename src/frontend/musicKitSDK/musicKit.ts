import musicKit from "./musicKitSDK";
import { Player, DefaultPlayer } from "../../types/player";
import { Song } from "../../types/song";

/* eslint-disable no-undef */
export class MusicKitPlayer extends DefaultPlayer implements Player {
	currentSong?: Song;
	progress = 0;

	songEnded = false;
	musicKit?: MusicKit.MusicKitInstance;
	userToken?: string;

	initialize (): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			musicKit().then(kit => {
				this.musicKit = kit;
				return this.musicKit.authorize();
			}).then(token => {
				this.userToken = token;

				this.musicKit.addEventListener("playbackStateDidChange", () => {
					if (this.musicKit.playbackState === MusicKit.PlaybackStates.ended) {
						this.songEnded = true;
						if (this.songEndHandler) {
							this.songEndHandler();
						}
					}
					if (this.musicKit.playbackState === MusicKit.PlaybackStates.waiting && this.songEnded) {
						this.musicKit.stop();
					}
				});
				resolve();
			}).catch(reject);
		});
	}

	seek (newPosition?: number): Promise<number> {
		if (!this.musicKit) {
			return Promise.reject(new Error("Player not ready"));
		}
		return new Promise<number>((resolve, reject) => {
			if (newPosition > -1) {
				this.musicKit.seekToTime(newPosition).then(() => {
					resolve(newPosition + 1);
				}).catch(reject);
			} else {
				resolve(this.musicKit.player.currentPlaybackTime);
			}
		});
	}

	setSong (song: Song): Promise<void> {
		if (song.musicKitId) {
			this.currentSong = song;
			return Promise.resolve();
		}
		return Promise.reject(new Error("Song must have a MusicKit ID"));
	}

	play (): Promise<void> {
		if (!this.musicKit) {
			return Promise.reject(new Error("Player not ready"));
		}
		if (!this.currentSong) {
			return Promise.reject(new Error("Song not set"));
		}
		if (!this.currentSong.musicKitId) {
			return Promise.reject(new Error("Song must contain a MusicKit ID"));
		}

		this.songEnded = false;
		this.musicKit.setQueue({
			items: [this.currentSong.musicKitId],
			song: this.currentSong.musicKitId
		});
		return new Promise<void>((resolve, reject) => this.musicKit.play().then(() => resolve()).catch(reject));
	}

	pause (): Promise<void> {
		if (this.musicKit) {
			this.musicKit.pause();
			return Promise.resolve();
		}
		return Promise.reject(new Error("Player not ready"));
	}

	volume (newVolume = -1): Promise<number> {
		if (this.musicKit) {
			if (newVolume > -1) {
				this.musicKit.player.volume = newVolume;
			}
			return Promise.resolve(this.musicKit.player.volume);
		}
		return Promise.reject(new Error("Player not ready"));
	}
}

/* eslint-enable no-undef */
