import { Song } from "./song";
import axios from "axios";
import { Link } from "./link";

export interface Playlist{
	songs: Song[],
	id?: string,
	user?: string,
	name?: string,
	add(song: Song): Playlist,
	render(songResponseCallback?: (song: Song) => void): Promise<Playlist>,
}

export class PlaylistObj implements Playlist {
	songs: Song[];
	id?: string;
	user?: string;
	name?: string;
	constructor (songs: Song[] = [], id?: string, user?: string, name?: string) {
		this.songs = songs;
		if (id) {
			this.id = id;
		}
		if (user) {
			this.user = user;
		}
		if (name) {
			this.name = name;
		}
	}

	add (song: Song): PlaylistObj {
		this.songs.push(song);
		return this;
	}

	render (songResponseCallback?: (song: Song) => void): Promise<PlaylistObj> {
		return new Promise<PlaylistObj>((resolve, reject) => {
			const requests = this.songs.map(song => {
				return axios.post(
					`/api/v1/songs?youtubeId=${encodeURIComponent(song.youtubeId)}&spotifyId=${encodeURIComponent(song.spotifyId)}`
				).then(resp => {
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

export interface PlaylistApi extends Playlist{
	links: Link[]
}

export class PlaylistApiObj extends PlaylistObj implements PlaylistApi {
	links: Link[]
	constructor (playlistBase: Playlist, links: Link[]) {
		super(playlistBase.songs, playlistBase.id, playlistBase.user, playlistBase.name);
		this.links = links;
	}
}
