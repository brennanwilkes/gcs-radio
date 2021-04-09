import { YoutubeResult } from "../../types/youtubeResult";
import { SpotifyResult } from "../../types/spotifyResult";
import { CONFIG } from "./util";

// Super cool stuff this
import levenshtein from "fast-levenshtein";

const sani = (inp: string): string => {
	return inp
		.toLowerCase()
		.replace(/[Vv][Ee][Vv][Oo]/g, "")
		.replace(/ - topic/g, "")
		.replace(/[^a-zA-Z .0-9-()]/g, "")
		.replace(/video ?/g, "")
		.replace(/lyric ?/, "")
		.replace(/with ?/g, "")
		.replace(/feat.?u?r?e?s?i?n?g? ?/g, "")
		.replace(/official ?/g, "")
		.replace(/audio ?/g, "")
		.replace(/performance ?/g, "");
};

export default function (spotify: SpotifyResult, youtube: YoutubeResult): boolean {
	if (!CONFIG.matchWithYoutube) {
		return true;
	}

	const titDis = levenshtein.get(sani(youtube.title), sani(spotify.title));
	const titDis2 = levenshtein.get(sani(youtube.youtubeTitle).replace(new RegExp(sani(spotify.artist), "g"), ""), sani(spotify.title));
	const titThresh = (spotify.title.length + youtube.title.length) / 2;
	const artDis = levenshtein.get(sani(youtube.artist), sani(spotify.artist));
	const artDis2 = levenshtein.get(sani(youtube.youtubeArtist), sani(spotify.artist));
	const artThresh = (spotify.artist.length + youtube.artist.length) / 8;
	const albDis = levenshtein.get(sani(youtube.album), sani(spotify.album));
	const albThresh = (spotify.album.length + youtube.album.length) / 2;

	const durationDis = Math.abs(spotify.duration - youtube.duration);
	const durationTresh = spotify.duration * 0.1;

	const evaluation = ((Math.min(titDis, titDis2) < titThresh ? 1 : 0) + (albDis < albThresh ? 1 : 0) + (Math.min(artDis, artDis2) < artThresh ? 1 : 0) >= 1) && durationDis <= durationTresh;

	return evaluation;
}
