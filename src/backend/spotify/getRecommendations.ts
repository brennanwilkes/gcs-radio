import { SpotifyResult } from "../../types/spotifyResult";
import { generateRefreshedCredential } from "./connection";

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import SpotifyApi from "spotify-web-api-node";
/* eslint-enable no-unused-vars */
/* eslint-enable @typescript-eslint/no-unused-vars */

import { getSpotifyTrack } from "./searchSpotify";

/* eslint-disable camelcase */
export interface RecommendationOptions{
	limit?: number,
	seed_artists?: ReadonlyArray<string>;
	seed_genres?: ReadonlyArray<string>;
	seed_tracks?: ReadonlyArray<string>;

	target_acousticness?: number;
	min_acousticness?: number;
	max_acousticness?: number;

	target_danceability?: number;
	min_danceability?: number;
	max_danceability?: number;

	target_energy?: number;
	min_energy?: number;
	max_energy?: number;

	target_instrumentalness?: number;
	min_instrumentalness?: number;
	max_instrumentalness?: number;

	target_key?: number;

	target_mode?: number;
	target_loudness?: number;
	target_tempo?: number;

	target_valence?: number;
	min_valence?: number;
	max_valence?: number;
}
/* eslint-enable camelcase */

const getMinMax = (target: number, weight = 0.2):number[] => [Math.max(0, target - weight), Math.min(1, target + weight)];

export default async (options: RecommendationOptions, userAccessToken?: string): Promise<SpotifyResult[]> => {
	options.limit = options.limit ?? 1;
	if (options.seed_artists) {
		options.seed_artists = options.seed_artists.slice(0, 5);
	}
	if (options.seed_genres) {
		options.seed_genres = options.seed_genres.slice(0, 5);
	}
	if (options.seed_tracks) {
		options.seed_tracks = options.seed_tracks.slice(0, 5);
	}
	if (options.target_valence) {
		options.min_valence = getMinMax(options.target_valence)[0];
		options.max_valence = getMinMax(options.target_valence)[1];
	}
	if (options.target_instrumentalness) {
		options.min_instrumentalness = getMinMax(options.target_instrumentalness)[0];
		options.max_instrumentalness = getMinMax(options.target_instrumentalness)[1];
	}
	if (options.target_energy) {
		options.min_energy = getMinMax(options.target_energy)[0];
		options.max_energy = getMinMax(options.target_energy)[1];
	}
	if (options.target_danceability) {
		options.min_danceability = getMinMax(options.target_danceability)[0];
		options.max_danceability = getMinMax(options.target_danceability)[1];
	}
	if (options.target_acousticness) {
		options.min_acousticness = getMinMax(options.target_acousticness)[0];
		options.max_acousticness = getMinMax(options.target_acousticness)[1];
	}

	return new Promise<SpotifyResult[]>((resolve, reject) => {
		generateRefreshedCredential().then(async spotifyApi => {
			if (userAccessToken) {
				spotifyApi.setAccessToken(userAccessToken);
			}

			return spotifyApi.getRecommendations(options);
		}).then(recommendationData => {
			return Promise.all(recommendationData.body.tracks.map(s => getSpotifyTrack(s.id)));
		}).then(resolve).catch(reject);
	});
};
