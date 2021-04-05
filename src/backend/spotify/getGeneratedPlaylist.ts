import { SpotifyResult } from "../../types/spotifyResult";
import { generateRefreshedCredential } from "./connection";
import { Request } from "express";
import Song from "../../database/models/song";

/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import SpotifyApi from "spotify-web-api-node";
/* eslint-enable no-unused-vars */
/* eslint-enable @typescript-eslint/no-unused-vars */

import arrayshuffle from "array-shuffle";

import getRecommendations, { RecommendationOptions } from "./getRecommendations";
import { CONFIG } from "../util/util";
import { mongoose } from "../../database/connection";

export const getForMePlaylist = async (userAccessToken: string, time_range: "long_term" | "medium_term" | "short_term" = "long_term", limit = 30): Promise<SpotifyResult[]> => {
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

export default (req: Request): Promise<SpotifyResult[]> => {
	const options: RecommendationOptions = {};
	if (req.body.acousticness !== undefined) {
		options.target_acousticness = req.body.acousticness;
	}
	if (req.body.danceability !== undefined) {
		options.target_danceability = req.body.danceability;
	}
	if (req.body.energy !== undefined) {
		options.target_energy = req.body.energy;
	}
	if (req.body.instrumentalness !== undefined) {
		options.target_instrumentalness = req.body.instrumentalness;
	}
	if (req.body.key !== undefined) {
		options.target_key = req.body.key;
	}
	if (req.body.loudness !== undefined) {
		options.target_loudness = req.body.loudness;
	}
	if (req.body.mode !== undefined) {
		options.target_mode = req.body.mode ? 1 : 0;
	}
	if (req.body.tempo !== undefined) {
		options.target_tempo = req.body.tempo;
	}
	if (req.body.valence !== undefined) {
		options.target_valence = req.body.valence;
	}
	options.limit = ((req.query.limit as unknown) as number | undefined) ?? CONFIG.defaultApiLimit;

	return new Promise<SpotifyResult[]>((resolve, reject) => {
		Promise.all((req.body.songs as string[]).map(id => Song.findOne({
			_id: new mongoose.Types.ObjectId(id)
		}))).then(docs => {
			if (docs.filter(doc => doc === null).length > 0) {
				reject(new Error("Failed to find seed song"));
			} else {
				options.seed_tracks = docs.map(doc => doc?.spotifyId ?? "ERROR");
				getRecommendations(options).then(resolve).catch(reject);
			}
		}).catch(reject);
	});
};
