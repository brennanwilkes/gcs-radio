import { YoutubeResult } from "../types/youtubeResult";
import { SpotifyResult } from "../types/spotifyResult";
import levenshtein from "fast-levenshtein";

const sani = (inp: string): string => {
	return inp
		.toLowerCase()
		.replace(/[Vv][Ee][Vv][Oo]/g, "")
		.replace(/ - topic/g, "")
		.replace(/[^a-zA-Z .0-9-]/g, "")
		.replace(/video ?/g, "")
		.replace(/lyric ?/, "");
};

export default function matches (spotify: SpotifyResult, youtube: YoutubeResult): boolean {
	const titDis = levenshtein.get(sani(youtube.title), sani(spotify.title));
	const titDis2 = levenshtein.get(sani(youtube.youtubeTitle), sani(spotify.title));
	const titThresh = (spotify.title.length + youtube.title.length) / 2;
	const artDis = levenshtein.get(sani(youtube.artist), sani(spotify.artist));
	const artDis2 = levenshtein.get(sani(youtube.youtubeArtist), sani(spotify.artist));
	const artThresh = (spotify.artist.length + youtube.artist.length) / 8;
	const albDis = levenshtein.get(sani(youtube.album), sani(spotify.album));
	const albThresh = (spotify.album.length + youtube.album.length) / 2;

	// console.log(titDis < titThresh ? "succeeded" : `failed (${youtube.title.toLowerCase()} / ${spotify.title.toLowerCase()})`, "title")
	// console.log(titDis2 < titThresh ? "succeeded" : `failed (${youtube.youtubeTitle.toLowerCase()} / ${spotify.title.toLowerCase()})`, "title")
	// console.log(albDis < albThresh ? "succeeded" : `failed (${youtube.album.toLowerCase()} / ${spotify.album.toLowerCase()})`, "albumn")
	// console.log(artDis < artThresh ? "succeeded" : `failed (${youtube.artist.toLowerCase()} / ${spotify.artist.toLowerCase()})`, "artist")
	// console.log(artDis2 < artThresh ? "succeeded" : `failed (${youtube.youtubeArtist.toLowerCase()} / ${spotify.artist.toLowerCase()})`, "artist")

	return ((Math.min(titDis, titDis2) < titThresh ? 1 : 0) + (albDis < albThresh ? 1 : 0) + (Math.min(artDis, artDis2) < artThresh ? 1 : 0) >= 2);
}
