import resolveSongs from "./resolveSongs";
import { CONFIG } from "./util";

process.env.MATCH_WITH_YOUTUBE = "true";
CONFIG.matchWithYoutube = true;


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

const invalidSong = {
	title: "DLFKJSLDKJ aljd asd930 dskasdfklj asdfkljfdsakl a",
	artist: "asfklskld;skl;kld;kl dk ;ld kd ;lksd;lk adl k;sd",
	album: "popopodapfo asdpfpao sfasdklfas;dkf",
	duration: 100000000000,
	explicit: false,
	spotifyId: "7GDDxCiTyiQuC1kig8AqFH",
	artistSpotifyId: "536BYVgOnRky0xjsPT96zl",
	albumSpotifyId: "5Z5DIr86vr1F4ZJbRFuQ6Q",
	thumbnailUrl: "https://i.scdn.co/image/ab67616d0000b273015d7007c3c0390a62c6f20b",
	releaseDate: "2013-01-01",
}

test("Resolves a valid song", done => {
	expect.assertions(10);
	resolveSongs([validSong]).then(res => {
		expect(res.length).toBe(1);
		expect(res[0].title).toBe(validSong.title);
		expect(res[0].artist).toBe(validSong.artist);
		expect(res[0].album).toBe(validSong.album);
		expect(res[0].duration).toBe(validSong.duration);
		done();
	});

	resolveSongs([validSong], 3).then(res => {
		expect(res.length).toBe(1);
		expect(res[0].title).toBe(validSong.title);
		expect(res[0].artist).toBe(validSong.artist);
		expect(res[0].album).toBe(validSong.album);
		expect(res[0].duration).toBe(validSong.duration);
		done();
	});
});

test("Resolves to empty list on invalid song", done => {
	expect.assertions(1);
	resolveSongs([invalidSong]).then(res => {
		expect(res.length).toBe(0);
		done();
	});
});
