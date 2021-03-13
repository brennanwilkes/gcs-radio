 import {playerSettings, play, getAccessToken } from "./spotifyWebSDK";

var spotifyPlayer: Spotify.SpotifyPlayer;
var playing: string | undefined;
var progress: number = 0;

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
export const spotifySeek = (position?: number): number => {
	if(position){
		spotifyPlayer.seek(position);
		progress = position;
		return position;
	}
	else{
		return progress;
	}
}

window.onSpotifyWebPlaybackSDKReady = (): void => {
	getAccessToken().then(() => {
		spotifyPlayer = new Spotify.Player(playerSettings);

		spotifyPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
		spotifyPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
		spotifyPlayer.addListener('account_error', ({ message }) => { console.error(message); });
		spotifyPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

		spotifyPlayer.addListener('player_state_changed', ({position}) => {
			progress = position;
		});


		// Ready
		spotifyPlayer.addListener('ready', ({ device_id }) => {
			console.log('Ready with Device ID', device_id);
		});
		spotifyPlayer.addListener('not_ready', ({ device_id }) => {
			console.log('Device ID has gone offline', device_id);
		});

		// Connect to the player!
		spotifyPlayer.connect();
	}).catch(console.error);
};
