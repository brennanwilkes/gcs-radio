import musicKit from "./musicKitSDK";
/* eslint-disable no-undef */

export const musicKitAuth = ():Promise<MusicKit.MusicKitInstance> => {
	return new Promise<MusicKit.MusicKitInstance>((resolve, reject) => {
		let kitCache: MusicKit.MusicKitInstance | undefined;
		musicKit().then(kit => {
			kitCache = kit;
			return kit.authorize();
		}).then(id => {
			resolve(kitCache as MusicKit.MusicKitInstance);
		}).catch(reject);
	});
};

export const musicKitPlayId = (id: string): Promise<void> => {
	return new Promise<void>((resolve, reject) => {
		musicKit().then(kit => {
			songEnded = false;
			// set song id
			kit.play();
		}).catch(reject);
	});
};

export const musickitPause = () => {
	musicKit().then(kit => {
		kit.pause();
	}).catch(console.error);
};

export const musicKitSeek = (position = -1): Promise<number> => {
	return new Promise<number>((resolve, reject) => {
		musicKit().then(kit => {
			if (position > -1) {
				kit.seekToTime(position);
				resolve(position + 1);
			} else {
				resolve(kit.player.currentPlaybackTime);
			}
		}).catch(reject);
	});
};

export const musicKitVolume = (value: number): Promise<void> => {
	return new Promise<void>((resolve, reject) => {
		musicKit().then(kit => {
			kit.player.volume = value;
			resolve();
		}).catch(reject);
	});
};

let transitionCallback: (() => void) | undefined;
export const setTransitionCallback = (callback: () => void) => {
	transitionCallback = callback;
};

var songEnded = false;
musicKit().then(kit => {
	kit.addEventListener("playbackStateDidChange", () => {
		if (kit.playbackState === MusicKit.PlaybackStates.ended) {
			songEnded = true;
			if (transitionCallback) {
				transitionCallback();
			}
		}
		if (kit.playbackState === MusicKit.PlaybackStates.waiting && songEnded) {
			kit.stop();
		}
	});
});
/* eslint-enable no-undef */
