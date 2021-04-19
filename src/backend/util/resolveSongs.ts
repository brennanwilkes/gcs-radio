import { Song, SongFromSpotify } from "../../types/song";
import { SpotifyResult } from "../../types/spotifyResult";
import { CONFIG } from "./util";
import youtubePlayableConverter from "../youtube/youtubePlayableConverter";
import musicKitPlayableConverter from "../musicKit/musicKitPlayableConverter";
import { basePlayableConverter } from "../../types/playables/playable";

const conversions = [
	{
		flag: CONFIG.matchWithYoutube,
		converter: youtubePlayableConverter
	},
	{
		flag: CONFIG.matchWithMusicKit,
		converter: musicKitPlayableConverter
	}
];

const converters = (): basePlayableConverter<Song>[] => conversions.filter(conversionMapping => conversionMapping.flag).map(conversionMapping => conversionMapping.converter);

export default function (spotifyResults: SpotifyResult[]): Promise<Song[]> {
	return Promise.all(spotifyResults.map(async spotify => {
		let song: Song = new SongFromSpotify(spotify);
		const upgrades = await Promise.all(converters().map(converter => converter.upgradeToPlayable(song)));
		upgrades.forEach(upgrade => {
			song = { ...song, ...upgrade };
		});
		return song;
	}));
}
