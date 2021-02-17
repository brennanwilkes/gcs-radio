import { SpotifyResult, SpotifyResultFromApi } from "../../types/spotifyResult";
import connection from "./connection";

export default async (query: string): Promise<SpotifyResult[]> => {
	return new Promise<SpotifyResult[]>((resolve, reject) => {
		connection.then(spotifyApi => {
			spotifyApi.searchTracks(query).then(data => {
				if (data.body?.tracks?.items) {
					resolve(data.body.tracks.items.map(item => new SpotifyResultFromApi(item)));
				} else {
					reject(new Error("Spotify returned invalid data"));
				}
			}).catch(err => reject(new Error(err)));
		}).catch(err => reject(new Error(err)));
	});
};

export async function getSpotify (id: string): Promise<SpotifyResult> {
	return new Promise<SpotifyResult>((resolve, reject) => {
		connection.then(spotifyApi => {
			spotifyApi.getTracks([id]).then(data => {
				if (data.body?.tracks) {
					resolve(new SpotifyResultFromApi(data.body.tracks[0]));
				} else {
					reject(new Error("Spotify returned invalid data"));
				}
			}).catch(err => reject(new Error(err)));
		}).catch(err => reject(new Error(err)));
	});
}
