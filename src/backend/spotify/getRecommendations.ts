import { SpotifyResult } from "../../types/spotifyResult";
import { generateRefreshedCredential } from "./connection";

/* eslint-disable no-unused-vars */
import SpotifyApi from "spotify-web-api-node";
/* eslint-enable no-unused-vars */
import { getSpotifyTrack } from "./searchSpotify";

/* eslint-disable camelcase */
export interface RecommendationOptions{
	limit?: number,
	seed_artists?: ReadonlyArray<string>;
	seed_genres?: ReadonlyArray<string>;
	seed_tracks?: ReadonlyArray<string>;
	target_acousticness?: number;
	target_danceability?: number;
	target_duration_ms?: number;
	target_energy?: number;
	target_instrumentalness?: number;
	target_key?: number;
	target_liveness?: number;
	target_loudness?: number;
	target_mode?: number;
	target_popularity?: number;
	target_speechiness?: number;
	target_tempo?: number;
	target_time_signature?: number;
	target_valence?: number;
}
/* eslint-enable camelcase */

export default async (options: RecommendationOptions, userAccessToken?: string): Promise<SpotifyResult[]> => {
	options.limit = options.limit ?? 1;
	options.seed_artists = options.seed_artists ? options.seed_artists.slice(0, 5) : undefined;
	options.seed_genres = options.seed_genres ? options.seed_genres.slice(0, 5) : undefined;
	options.seed_tracks = options.seed_tracks ? options.seed_tracks.slice(0, 5) : undefined;

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
