import { SpotifyResult } from "../../types/spotifyResult";
import { YoutubeResult } from "../../types/youtubeResult";
import resultMatches from "./resultMatches";

const song1 = {
	title: "title",
	youtubeTitle: "TITLE FEAT. LYRICS VIDEO official performance #$%^&*",
	artist: "artist",
	youtubeArtist: "ARTIST",
	album: "album",
	duration: 1000
}

const song2 = {
	title: "titl",
	youtubeTitle: "ITLE FEAT. LYRICS VIDEO official performance #$%^&*",
	artist: "artst",
	youtubeArtist: "ARTIST1",
	album: "alum",
	duration: 1005
}

const song3 = {
	title: "something else",
	youtubeTitle: "something else",
	artist: "someone different",
	youtubeArtist: "another dude",
	album: "",
	duration: 50000
}

test("Identical songs match", () => {
	expect(resultMatches(song1 as unknown as SpotifyResult, song1 as YoutubeResult));
});

test("Simmilar songs match", () => {
	expect(resultMatches(song1 as unknown as SpotifyResult, song2 as YoutubeResult));
	expect(resultMatches(song2 as unknown as SpotifyResult, song1 as YoutubeResult));
});

test("Different songs don't match", () => {
	expect(resultMatches(song1 as unknown as SpotifyResult, song3 as YoutubeResult));
	expect(resultMatches(song3 as unknown as SpotifyResult, song1 as YoutubeResult));
});
