import resolveSongs from "./resolveSongs";
import { CONFIG } from "./util";

process.env.MATCH_WITH_YOUTUBE = "false";
CONFIG.matchWithYoutube = false;
CONFIG.matchWithMusicKit = false;
process.env.MATCH_WITH_MUSIC_KIT = "false";


const validSong = {
	title: "Next Year - RAC remix",
	artist: "Two Door Cinema Club",
	album: "Next Year (Remixes)",
	duration: 286093,
	explicit: false,
	spotifyId: "7GDDxCiTyiQuC1kig8AqFH",
	artistSpotifyId: "536BYVgOnRky0xjsPT96zl",
	albumSpotifyId: "5Z5DIr86vr1F4ZJbRFuQ6Q",
	thumbnailUrl: "https://i.scdn.co/image/ab67616d0000b273015d7007c3c0390a62c6f20b",
	releaseDate: "2013-01-01",
}


test("Resolves a valid song", done => {
	expect.assertions(5);
	resolveSongs([validSong]).then(res => {
		expect(res.length).toBe(1);
		expect(res[0].title).toBe(validSong.title);
		expect(res[0].artist).toBe(validSong.artist);
		expect(res[0].album).toBe(validSong.album);
		expect(res[0].duration).toBe(validSong.duration);
		done();
	});

});
