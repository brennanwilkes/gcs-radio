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
				if (this.musicKit) {
					this.musicKit.addEventListener("playbackProgressDidChange", () => {
						const remaining = this.musicKit?.player?.currentPlaybackTimeRemaining ?? 0;
						if (remaining <= 1 && this.musicKit) {
							this.songEnded = true;
							if (remaining > 0) {
								this.musicKit.stop();
							}
							if (this.songEndHandler) {
								this.songEndHandler();
							}
						}
					});

					resolve();
				} else {
					reject(new Error("Something went wrong"));
				}
			}).catch(reject);
		});
	}

	seek (newPosition = -1): Promise<number> {
		if (!this.musicKit) {
			return Promise.reject(new Error("Player not ready"));
		}
		return new Promise<number>((resolve, reject) => {
			if (!this.musicKit) {
				reject(new Error("Something went wrong"));
			} else if (newPosition > -1) {
				this.musicKit.seekToTime(Math.floor(newPosition / 1000)).then(() => {
					resolve(newPosition + 1);
				}).catch(reject);
			} else {
				resolve(this.musicKit.player.currentPlaybackTime * 1000);
			}
		});
	}

	setSong (song: Song): Promise<void> {
		if (song.musicKitId) {
			this.currentSong = song;
			return new Promise<void>((resolve, reject) => {
				if (!this.musicKit) {
					reject(new Error("Player not ready"));
				} else {
					this.musicKit.setQueue({
						items: [song.musicKitId as string],
						song: song.musicKitId
					}).then(() => resolve()).catch(reject);
				}
			});
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

		this.songEnded = false;
		return new Promise<void>((resolve, reject) => {
			if (this.musicKit) {
				this.musicKit.play().then(() => resolve()).catch(reject);
			} else {
				reject(new Error("Player is not ready"));
			}
		});
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
