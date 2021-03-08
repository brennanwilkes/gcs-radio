import {playerSettings, play, access_token } from "./spotifyWebSDK";

var spotifyPlayer: Spotify.SpotifyPlayer;

export const playId = (id: string): boolean => {
	if(access_token === "INVALID"){
		return false;
	}
	play({
		playerInstance: spotifyPlayer,
		spotify_uri: `spotify:track:${id}`,
	});
	return true;
}

window.onSpotifyWebPlaybackSDKReady = (): void => {
	if(access_token !== "INVALID"){
		spotifyPlayer = new Spotify.Player(playerSettings);

		spotifyPlayer.addListener('initialization_error', ({ message }) => { console.error(message); });
		spotifyPlayer.addListener('authentication_error', ({ message }) => { console.error(message); });
		spotifyPlayer.addListener('account_error', ({ message }) => { console.error(message); });
		spotifyPlayer.addListener('playback_error', ({ message }) => { console.error(message); });

		// Playback status updates
		spotifyPlayer.addListener('player_state_changed', state => { console.log(state); });

		// Ready
		spotifyPlayer.addListener('ready', ({ device_id }) => {
			console.log('Ready with Device ID', device_id);
		});
		spotifyPlayer.addListener('not_ready', ({ device_id }) => {
			console.log('Device ID has gone offline', device_id);
		});

		// Connect to the player!
		spotifyPlayer.connect();
	}
};
