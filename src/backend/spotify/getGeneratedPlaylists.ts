import { SpotifyResult } from "../../types/spotifyResult";
import { generateRefreshedCredential } from "./connection";

/* eslint-disable no-unused-vars */
import SpotifyApi from "spotify-web-api-node";
/* eslint-enable no-unused-vars */

import { getSpotifyTrack, getSpotifyTracksByPlaylist } from "./searchSpotify";

export default async (userAccessToken: string): Promise<SpotifyResult[][]> => {
	return new Promise<SpotifyResult[][]>((resolve, reject) => {
		generateRefreshedCredential().then(async spotifyApi => {
			spotifyApi.setAccessToken(userAccessToken);

			let playlists: SpotifyResult[][] = [];
			spotifyApi.getMe().then(userData => {
				return spotifyApi.getUserPlaylists(userData.body.id, {
					limit: 50
				});
			}).then(async userPlaylistData => {
				const filtered = userPlaylistData.body.items.filter(d => d.name.match(/.*[Dd]iscover ?[Ww]eekly.*/) || d.name.match(/.*[Dd]aily ?[Mm]ix.*/));
				playlists = await Promise.all(filtered.map(p => getSpotifyTracksByPlaylist(p.id)));
				return spotifyApi.getMyTopArtists();
			}).then(artistData => {
				return spotifyApi.getRecommendations({
					seed_artists: artistData.body.items.map(a => a.id).slice(0, 3),
					limit: 30
				});
			}).then(async recommendationData => {
				const converted = await Promise.all(recommendationData.body.tracks.map(s => getSpotifyTrack(s.id)));
				playlists = [...playlists, converted];
				resolve(playlists);
			}).catch(reject);
		}).catch(err => reject(new Error(err)));
	});
};
