import { SpotifyResult } from "../../types/spotifyResult";
import { generateRefreshedCredential } from "./connection";

/* eslint-disable no-unused-vars */
import SpotifyApi from "spotify-web-api-node";
/* eslint-enable no-unused-vars */

import arrayshuffle from "array-shuffle";

import getRecommendations from "./getRecommendations";

export default async (userAccessToken: string, time_range: "long_term" | "medium_term" | "short_term" = "long_term", limit = 30): Promise<SpotifyResult[]> => {
	return new Promise<SpotifyResult[]>((resolve, reject) => {
		generateRefreshedCredential().then(spotifyApi => {
			spotifyApi.setAccessToken(userAccessToken);
			return spotifyApi.getMyTopArtists({
				time_range
			});
		}).then(artistData => {
			return getRecommendations({
				limit,
				seed_artists: arrayshuffle(artistData.body.items.map(a => a.id).slice(0, 15))
			}, userAccessToken);
		}).then(resolve).catch(reject);
	});
};
