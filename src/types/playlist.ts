import { Song } from "./song";
import axios from "axios";
import { Link } from "./link";

export interface PlaylistDetails{
	user: string,
	name: string,
	description: string,
	features: string[],
	private?: boolean
}

export interface Playlist{
	songs: Song[],
	id?: string,
	details?: PlaylistDetails,
	private: boolean,
	add(song: Song): Playlist,
	render(songResponseCallback?: (song: Song) => void): Promise<Playlist>,
}

export class PlaylistObj implements Playlist {
	songs: Song[];
	id?: string;
	details?: PlaylistDetails;
	private: boolean;
	constructor (songs: Song[] = [], id?: string, details?: PlaylistDetails, privateOverride?: boolean) {
		this.songs = songs;
		if (id) {
			this.id = id;
		}
		if (details) {
			this.details = {
				user: details.user,
				name: details.name,
				description: details.description,
				features: details.features
			};
		}
		this.private = privateOverride ?? (details?.private ?? true);
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
		super(playlistBase.songs, playlistBase.id, playlistBase.details, playlistBase.private);
		this.links = links;
	}
}
