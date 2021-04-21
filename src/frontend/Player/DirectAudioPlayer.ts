import { Song } from "../../types/song";
import { Player, DefaultPlayer } from "../../types/player";
import SongHowl from "../../types/songHowl";

export class DirectAudioPlayer extends DefaultPlayer implements Player {
	currentSong?: Song;
	currentHowl?: SongHowl;

	invalidSongErr (): Error {
		return new Error(`Song is not ${this.currentSong ? "loaded" : "set"}`);
	}

	initialize (): Promise<void> {
		return Promise.resolve();
	}

	seek (newPosition?: number): Promise<number> {
		if (this.currentHowl) {
			if (newPosition) {
				this.currentHowl.seek(newPosition);
			}
			return Promise.resolve((this.currentHowl.seek() as number) * 1000);
		} else {
			return Promise.reject(this.invalidSongErr());
		}
	}

	setSong (song: Song): Promise<void> {
		if (this.currentSong && song.audioId === this.currentSong?.audioId) {
			return Promise.resolve();
		}

		this.currentSong = song;
		this.currentHowl = new SongHowl(song);

		return new Promise<void>((resolve, reject) => {
			if (!this.currentHowl) {
				reject(new Error("Something went wrong"));
			} else {
				this.currentHowl.on("end", () => {
					if (this.songEndHandler) {
						this.songEndHandler();
					}
				});

				this.currentHowl.on("load", () => {
					resolve();
				});

				this.currentHowl.on("loaderror", () => {
					reject(new Error(`${this.currentSong?.title} failed to load`));
				});
				this.currentHowl.load();
			}
		});
	}

	play (): Promise<void> {
		if (this.currentHowl) {
			this.currentHowl.play();
			return Promise.resolve();
		} else {
			return Promise.reject(this.invalidSongErr());
		}
	}

	pause (): Promise<void> {
		if (this.currentHowl) {
			this.currentHowl.pause();
			return Promise.resolve();
		} else {
			return Promise.reject(this.invalidSongErr());
		}
	}

	volume (newVolume?: number): Promise<number> {
		if (this.currentHowl) {
			if (newVolume) {
				this.currentHowl.volume(newVolume);
			}
			return Promise.resolve(this.currentHowl.volume());
		} else {
			return Promise.reject(this.invalidSongErr());
		}
	}
}
