import { SpotifyResult } from "../../types/spotifyResult";
import { generateRefreshedCredential } from "./connection";

/* eslint-disable no-unused-vars */
import SpotifyApi from "spotify-web-api-node";
/* eslint-enable no-unused-vars */

import { getSpotifyTrack } from "./searchSpotify";

export default async (userAccessToken: string, time_range: "long_term" | "medium_term" | "short_term" = "long_term"): Promise<SpotifyResult[]> => {
	return new Promise<SpotifyResult[]>((resolve, reject) => {
		generateRefreshedCredential().then(async spotifyApi => {
			spotifyApi.setAccessToken(userAccessToken);
			spotifyApi.getMyTopArtists({
				time_range
			}).then(artistData => {
				return spotifyApi.getRecommendations({
					seed_artists: artistData.body.items.map(a => a.id).slice(0, 5),
					limit: 30
				});
			}).then(async recommendationData => {
				const converted = await Promise.all(recommendationData.body.tracks.map(s => getSpotifyTrack(s.id)));
				resolve(converted);
			}).catch(reject);
		}).catch(err => reject(new Error(err)));
	});
};
