import {playerSettings, play, getAccessToken } from "./spotifyWebSDK";
import { Player, DefaultPlayer } from "../../types/player";
import { Song } from "../../types/song";


var deviceId: string | undefined;
export const getDeviceId = () => deviceId ?? "INVALID";

export class SpotifyPlayer extends DefaultPlayer implements Player{

	currentSong?: Song;
	ready: boolean = false;
	hasMadeProgress: boolean = false;
	progress: number = 0;
	spotifyPlayer?: Spotify.SpotifyPlayer;
	deviceId?: string;
	isPlaying: boolean = false;
	playingId?: string;

	getDeviceId(): string {
		return this.deviceId ?? "INVALID";
	}

	initialize(): Promise<void>{
		if(this.ready){
			return Promise.resolve();
		}
		return new Promise<void>((resolve, reject) => {
			window.onSpotifyWebPlaybackSDKReady = (): void => {
				getAccessToken().then(() => {
					this.spotifyPlayer = new Spotify.Player(playerSettings);


					const onError = (msg: string) => {
						this.errorHandler(new Error(msg));
						if(!this.ready) reject(new Error(msg));
					}
					this.spotifyPlayer.addListener('initialization_error', ({ message }) => onError(message));
					this.spotifyPlayer.addListener('authentication_error', ({ message }) => onError(message));
					this.spotifyPlayer.addListener('account_error', ({ message }) => onError(message));
					this.spotifyPlayer.addListener('playback_error', ({ message }) => onError(message));

					setInterval(() => {
						if(this.spotifyPlayer && this.ready){
							this.spotifyPlayer.getCurrentState().then(state => {
								if(this.hasMadeProgress && this.progress !== 0 && state?.position === 0 && this.songEndHandler){
									this.songEndHandler();
									this.hasMadeProgress = false;
								}
								this.hasMadeProgress = ((state?.position ?? 0) > 0);

								this.progress = state?.position ?? 0;
							}).catch(this.errorHandler);
						}
					}, 100);

					// Ready
					this.spotifyPlayer.addListener('ready', ({ device_id }) => {
						this.ready = true;
						this.deviceId = device_id;
						deviceId = device_id;
						resolve();
					})
					this.spotifyPlayer.addListener('not_ready', () => {
						this.errorHandler(new Error("Device has gone offline"));
						if(!this.ready){
							reject(new Error("Device has gone offline"));
						}
						this.ready = false;
					});

					// Connect to the player!
					this.spotifyPlayer.connect();
				}).catch(console.error);
			};
		});
	}

	seek(newPosition: number = -1): Promise<number>{
		if(!this.spotifyPlayer || !this.ready){
			return Promise.reject(new Error("Player is not yet ready"));
		}
		if(newPosition > -1){
			this.spotifyPlayer.seek(newPosition + 1);
			this.progress = newPosition + 1;
			return Promise.resolve(newPosition + 1);
		}
		else{
			return Promise.resolve(this.progress);
		}
	}

	setSong(song: Song): Promise<void>{
		if(song.spotifyId){
			this.currentSong = song;
			return Promise.resolve();
		}
		return Promise.reject(new Error("Song must have a Spotify ID"));
	}

	play(): Promise<void>{
		if(!this.currentSong){
			return Promise.reject(new Error("Song not set"));
		}
		return new Promise<void>((resolve, reject) => {
			getAccessToken().then(() => {
				if(!this.isPlaying && this.currentSong?.spotifyId === this.playingId){
					this.spotifyPlayer.resume();
				}
				else{
					play({
						playerInstance: this.spotifyPlayer,
						spotify_uri: `spotify:track:${this.currentSong?.spotifyId}`,
					});
					this.playingId = this.currentSong?.spotifyId;
				}
				resolve();
			}).catch(reject);
		});
	}

	pause(): Promise<void> {
		if(this.spotifyPlayer){
			this.isPlaying = false;
			return this.spotifyPlayer.pause();
		}
		return Promise.reject(new Error("Player not ready"));
	}

	volume(newVolume: number = -1): Promise<number>{
		if(this.spotifyPlayer && this.ready){
			return new Promise<number>((resolve, reject) => {
				if(newVolume > -1){
					this.spotifyPlayer.setVolume(newVolume).then(() => {
						this.spotifyPlayer.getVolume().then(resolve).catch(reject);
					})
				}
				else{
					this.spotifyPlayer.getVolume().then(resolve).catch(reject);
				}
			});
		}
		return Promise.reject(new Error("Player is not ready"));
	}
}
