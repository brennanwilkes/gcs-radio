import { YoutubeResult } from "../types/youtubeResult";
import { SpotifyResult } from "../types/spotifyResult";
import levenshtein from "fast-levenshtein";

export default function matches (spotify: SpotifyResult, youtube: YoutubeResult): boolean {
	const titDis = levenshtein.get(youtube.title.toLowerCase(), spotify.title.toLowerCase());
	const titDis2 = levenshtein.get(youtube.youtubeTitle.toLowerCase(), spotify.title.toLowerCase());
	const titThresh = (spotify.title.length + youtube.title.length) / 2;
	const artDis = levenshtein.get(youtube.artist.toLowerCase(), spotify.artist.toLowerCase());
	const artDis2 = levenshtein.get(
		youtube.youtubeArtist.toLowerCase().replace(/[Vv][Ee][Vv][Oo]/g, "").replace(/ - topic/g, ""),
		spotify.artist.toLowerCase());
	const artThresh = (spotify.artist.length + youtube.artist.length) / 8;
	const albDis = levenshtein.get(youtube.album.toLowerCase(), spotify.album.toLowerCase());
	const albThresh = (spotify.album.length + youtube.album.length) / 2;

	// console.log(titDis < titThresh ? "succeeded" : `failed (${youtube.title.toLowerCase()} / ${spotify.title.toLowerCase()})`, "title")
	// console.log(titDis2 < titThresh ? "succeeded" : `failed (${youtube.youtubeTitle.toLowerCase()} / ${spotify.title.toLowerCase()})`, "title")
	// console.log(albDis < albThresh ? "succeeded" : `failed (${youtube.album.toLowerCase()} / ${spotify.album.toLowerCase()})`, "albumn")
	// console.log(artDis < artThresh ? "succeeded" : `failed (${youtube.artist.toLowerCase()} / ${spotify.artist.toLowerCase()})`, "artist")
	// console.log(artDis2 < artThresh ? "succeeded" : `failed (${youtube.youtubeArtist.toLowerCase()} / ${spotify.artist.toLowerCase()})`, "artist")

	return ((Math.min(titDis, titDis2) < titThresh ? 1 : 0) + (albDis < albThresh ? 1 : 0) + (Math.min(artDis, artDis2) < artThresh ? 1 : 0) >= 2);
}
