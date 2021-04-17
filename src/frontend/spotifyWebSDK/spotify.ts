 import {playerSettings, play, getAccessToken } from "./spotifyWebSDK";

var spotifyPlayer: Spotify.SpotifyPlayer;
var playing: string | undefined;
var progress: number = 0;

var deviceId: string | undefined;
export const getDeviceId = (): string => deviceId ?? "INVALID";

export const spotifyPlayId = (id: string): Promise<void> => {
	return new Promise<void>((resolve, reject) => {
		getAccessToken().then(() => {
			if(id === playing){
				spotifyPlayer.resume();
			}
			else{
				play({
					playerInstance: spotifyPlayer,
					spotify_uri: `spotify:track:${id}`,
				});
				playing = id;
			}
			resolve();
		}).catch(reject);
	});
}

export const spotifyPause = () => spotifyPlayer.pause();
export const spotifySeek = (position: number = -1): number => {
	if(position > -1){
		spotifyPlayer.seek(position + 1);
		progress = position + 1;
		return position + 1;
	}
	else{
		return progress;
	}
}

export const spotifyVolume = (value: number): void => {
	if(spotifyPlayer && isReady){
		spotifyPlayer.setVolume(value);
	}
}

var transitionCallback: (() => void) | undefined;
export const setTransitionCallback = (callback: () => void) => {
	transitionCallback = callback;
}

export var isReady = false;
var hasMadeProgress = false;
window.onSpotifyWebPlaybackSDKReady = (): void => {
	getAccessToken().then(() => {
		spotifyPlayer = new Spotify.Player(playerSettings);

		spotifyPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
		spotifyPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
		spotifyPlayer.addListener('account_error', ({ message }) => { console.error(message); });
		spotifyPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

		setInterval(() => {
			if(spotifyPlayer && isReady){
				spotifyPlayer.getCurrentState().then(state => {
					if(hasMadeProgress && progress !== 0 && state?.position === 0 && transitionCallback){
						transitionCallback();
						hasMadeProgress = false;
					}
					hasMadeProgress = ((state?.position ?? 0) > 0);

					progress = state?.position ?? 0;
				}).catch(console.error);
			}
		}, 100);

		// Ready
		spotifyPlayer.addListener('ready', ({ device_id }) => {
			isReady = true;
			deviceId = device_id;
		});
		spotifyPlayer.addListener('not_ready', ({ device_id }) => {
			isReady = false;
			console.log('Device ID has gone offline', device_id);
		});

		// Connect to the player!
		spotifyPlayer.connect();
	}).catch(console.error);
};
