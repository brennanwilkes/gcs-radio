import { SpotifyResult, SpotifyResultFromApi, SpotifyResultFromApiSimple } from "../../types/spotifyResult";
import connection from "./connection";

export default async (query: string): Promise<SpotifyResult[]> => {
	return new Promise<SpotifyResult[]>((resolve, reject) => {
		connection.then(spotifyApi => {
			spotifyApi.searchTracks(query).then(data => {
				if (data.body?.tracks?.items) {
					resolve(data.body.tracks.items.filter(item => !!item).map(item => new SpotifyResultFromApi(item)));
				} else {
					reject(new Error("Spotify returned invalid data"));
				}
			}).catch(err => reject(new Error(err)));
		}).catch(err => reject(new Error(err)));
	});
};

export async function getSpotify (id: string): Promise<SpotifyResult[]> {
	return new Promise<SpotifyResult[]>((resolve, reject) => {
		getSpotifyTrack(id).then(track => resolve([track])).catch(() => {
			getSpotifyTracksByPlaylist(id).then(resolve).catch(() => {
				getSpotifyTracksByAlbum(id).then(resolve).catch(() => {
					getSpotifyTracksByArtist(id).then(resolve).catch(reject);
				});
			});
		});
	});
}

export async function getSpotifyTrack (id: string): Promise<SpotifyResult> {
	return new Promise<SpotifyResult>((resolve, reject) => {
		connection.then(spotifyApi => {
			spotifyApi.getTracks([id]).then(data => {
				if (data.body?.tracks && data.body.tracks.length > 0) {
					resolve(new SpotifyResultFromApi(data.body.tracks[0]));
				} else {
					reject(new Error("Spotify returned invalid data"));
				}
			}).catch(err => reject(new Error(err)));
		}).catch(err => reject(new Error(err)));
	});
}

export async function getSpotifyTracksByPlaylist (id: string): Promise<SpotifyResult[]> {
	return new Promise<SpotifyResult[]>((resolve, reject) => {
		connection.then(spotifyApi => {
			spotifyApi.getPlaylist(id).then(data => {
				if (data.body?.tracks?.items) {
					resolve(data.body.tracks.items.map(song => new SpotifyResultFromApi(song.track)));
				} else {
					reject(new Error("Spotify returned invalid data"));
				}
			}).catch(err => reject(new Error(err)));
		}).catch(err => reject(new Error(err)));
	});
}

export async function getSpotifyTracksByAlbum (id: string): Promise<SpotifyResult[]> {
	return new Promise<SpotifyResult[]>((resolve, reject) => {
		connection.then(spotifyApi => {
			spotifyApi.getAlbum(id).then(album => {
				spotifyApi.getAlbumTracks(id).then(data => {
					if (data.body?.items) {
						resolve(data.body.items.map(song => new SpotifyResultFromApiSimple(song, album.body)));
					} else {
						reject(new Error("Spotify returned invalid data"));
					}
				}).catch(err => reject(new Error(err)));
			}).catch(err => reject(new Error(err)));
		}).catch(err => reject(new Error(err)));
	});
}

export async function getSpotifyTracksByArtist (id: string, countrycode = "CA"): Promise<SpotifyResult[]> {
	return new Promise<SpotifyResult[]>((resolve, reject) => {
		connection.then(spotifyApi => {
			spotifyApi.getArtistTopTracks(id, countrycode).then(data => {
				if (data.body?.tracks) {
					resolve(data.body.tracks.map(song => new SpotifyResultFromApi(song)));
				} else {
					reject(new Error("Spotify returned invalid data"));
				}
			}).catch(err => reject(new Error(err)));
		}).catch(err => reject(new Error(err)));
	});
}
