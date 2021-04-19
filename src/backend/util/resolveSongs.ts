import { Song, SongFromSpotify } from "../../types/song";
import { SpotifyResult } from "../../types/spotifyResult";
import { CONFIG } from "./util";
import youtubePlayableConverter from "../youtube/youtubePlayableConverter";

export default function (spotifyResults: SpotifyResult[]): Promise<Song[]> {
	return Promise.all(spotifyResults.map(spot => new SongFromSpotify(spot)).map(song => {
		return CONFIG.matchWithYoutube
			? youtubePlayableConverter.upgradeToPlayable(song)
			: Promise.resolve(song);
	}));
}
