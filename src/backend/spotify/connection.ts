import "dotenv/config";
import SpotifyWebApi from "spotify-web-api-node";
import { CONFIG, print } from "../util/util";
import dayjs from "dayjs";
import logger from "../logging/logger";

/* eslint-disable camelcase */
interface ClientCredentialsGrantResponse {
	access_token: string;
	expires_in: number;
	token_type: string;
}
/* eslint-enable camelcase */

let currentExpiry: dayjs.Dayjs = dayjs();

const generateWebApi = (api?: SpotifyWebApi):Promise<SpotifyWebApi> => {
	return new Promise<SpotifyWebApi>((resolve, reject) => {
		const clientId = CONFIG.spotifyClientId;
		const clientSecret = CONFIG.spotifyClientSecret;
		if (!clientId || !clientSecret) {
			print("No spotify credentials detected");
			reject(new Error("No spotify credentials detected"));
		} else {
			if (api) {
				resolve(api);
			} else {
				resolve(new SpotifyWebApi({
					clientId,
					clientSecret
				}));
			}
		}
	});
};

const generateAccessToken = (api?: SpotifyWebApi):Promise<ClientCredentialsGrantResponse> => {
	return new Promise<ClientCredentialsGrantResponse>((resolve, reject) => {
		generateWebApi(api).then(spotifyApi => {
			return spotifyApi.clientCredentialsGrant();
		}).then(data => {
			print("Generated new spotify access token");
			logger.logSpotifyConnection();
			resolve(data.body);
		}, err => {
			print("Something went wrong when retrieving an access token", err);
			reject(new Error(err));
		}).catch(reject);
	});
};

export const generateRefreshedCredential = (): Promise<SpotifyWebApi> => {
	return new Promise<SpotifyWebApi>((resolve, reject) => {
		if (currentExpiry && currentExpiry.isAfter(dayjs())) {
			currentApi.then(resolve).catch(reject);
		} else {
			currentApi = generateClientCredential();
			currentApi.then(api => {
				resolve(api);
			}).catch(reject);
		}
	});
};

const generateClientCredential = () => new Promise<SpotifyWebApi>((resolve, reject) => {
	generateWebApi().then(api => {
		generateAccessToken(api).then(data => {
			currentExpiry = dayjs().add(data.expires_in, "seconds");
			api.setAccessToken(data.access_token);
			resolve(api);
		}).catch(reject);
	}).catch(reject);
});

let currentApi = generateClientCredential();
export default currentApi;
