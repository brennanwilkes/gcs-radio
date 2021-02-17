import { Song } from "./song";
import axios from "axios";

export interface Playlist{
	songs: Song[],
	add(song: Song): Playlist,
	render(songResponseCallback?: (song: Song) => void): Promise<Playlist>,
}

export class PlaylistObj implements Playlist {
	songs: Song[];
	constructor (songs: Song[] = []) {
		this.songs = songs;
	}

	add (song: Song): PlaylistObj {
		this.songs.push(song);
		return this;
	}

	render (songResponseCallback?: (song: Song) => void) {
		return new Promise<PlaylistObj>((resolve, reject) => {
			const requests = this.songs.map(song => {
				return axios.post(`/api/v1/songs?youtubeId=${encodeURIComponent(song.youtubeId)}&spotifyId=${encodeURIComponent(song.spotifyId)}`).then(resp => {
					if (songResponseCallback) {
						songResponseCallback(resp.data.songs[0]);
					}
					return resp;
				});
			});

			Promise.all(requests).then(responses => {
				const converted: Song[] = responses.map(responses => responses.data.songs[0]);
				this.songs = converted;

				resolve(this);
			}).catch(reject);
		});
	}
}
