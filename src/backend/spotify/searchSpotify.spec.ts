import searchSpotify, { getSpotify, getSpotifyTrack, getSpotifyTracksByPlaylist, getSpotifyTracksByAlbum, getSpotifyTracksByArtist } from "../spotify/searchSpotify";
import { SpotifyResult } from "../../types/spotifyResult";

const spotifyIdRegex = /^[0-9A-Za-z]{22}$/;

const SAMPLE_DATA = [
	{id: "7JwXlCHubv8B3X4WusuZEL", type: "track", method: (id:string) => getSpotifyTrack(id).then(res => [res])},
	{id: "4aBLjtEUUg1424XB5WQgKP", type: "album", method: getSpotifyTracksByAlbum},
	{id: "6tuPdaFPIytg3l2f51L7Hw", type: "artist", method: getSpotifyTracksByArtist},
	{id: "6Euwyp0ni2p96tfEyQzyxe", type: "playlist", method: getSpotifyTracksByPlaylist}
]

const verifySong = (song: SpotifyResult) => {
	expect(song).toMatchObject({
		title: expect.any(String),
		artist: expect.any(String),
		album: expect.any(String),
		duration: expect.any(Number),
		explicit: expect.any(Boolean),
		spotifyId: expect.any(String),
		artistSpotifyId: expect.any(String),
		albumSpotifyId: expect.any(String),
		thumbnailUrl: expect.any(String),
		releaseDate: expect.any(String)
	});
	expect(song.spotifyId).toMatch(spotifyIdRegex);
	expect(song.albumSpotifyId).toMatch(spotifyIdRegex);
	expect(song.artistSpotifyId).toMatch(spotifyIdRegex);
}

const dummyResponse = () => { return {
	then: (callback: any) => callback({})
}};

const ERROR = "ERROR";
const dummyResponseErr = () => { return {
	then: dummyResponseErr,
	catch: (callback: any) => callback(ERROR)
}}



describe("Successful responses", () => {
	test("Searches spotify", done => {
		searchSpotify("Next Year").then(res => {
			res.forEach(verifySong);
			done();
		})
	});

	SAMPLE_DATA.forEach(data => {
		test(`Gets spotify ${data.type} data with default method`, done => {
			getSpotify(data.id).then(res => {
				res.forEach(verifySong);
				done();
			});
		});
		test(`Gets spotify ${data.type} data`, done => {
			data.method(data.id).then(res => {
				res.forEach(verifySong);
				done();
			})
		});

		test(`Rejects promise on invalid ID (${data.type})`, done => {
			expect.assertions(1);
			data.method("").catch(() => {
				expect(true).toBeTruthy();
				done();
			});
		});
	})
});

const importMethod = (type: string) => {
	if(type === "track"){
		return (id:string) => require("./searchSpotify").getSpotifyTrack(id).then((res:any) => [res])
	}
	else if(type === "album"){
		return require("./searchSpotify").getSpotifyTracksByAlbum;
	}
	else if(type === "artist"){
		return require("./searchSpotify").getSpotifyTracksByArtist;
	}
	else {
		return require("./searchSpotify").getSpotifyTracksByPlaylist;
	}
}

describe("Return invalid data handlers", () => {

	beforeEach(() => {
		jest.resetModules();
		jest.doMock('./connection', () => ({
			__esModule: true,
			generateRefreshedCredential: () => { return {
				then: jest.fn((callback) => {
					callback({
						getArtistTopTracks: dummyResponse,
						getAlbumTracks: dummyResponse,
						getPlaylist: dummyResponse,
						getTracks: dummyResponse,
						searchTracks: dummyResponse,
						getAlbum: dummyResponse
					});
				})
			}}
		}));
	});

	test("Rejects on invalid data (search)", done => {
		const searchSpotifyM = require("./searchSpotify").default;
		expect.assertions(1);
		searchSpotifyM("Next Year").catch((e: Error) => {
			expect(e).toStrictEqual(new Error("Spotify returned invalid data"));
			done();
		});
	})

	SAMPLE_DATA.forEach(data => {
		test(`Rejects on invalid data (${data.type})`, done => {
			const method = importMethod(data.type);
			expect.assertions(1);
			method(data.id).catch((e: Error) => {
				expect(e).toStrictEqual(new Error("Spotify returned invalid data"));
				done();
			});
		});
	})
});

describe("Albumn method fails", () => {
	beforeEach(() => {
		jest.resetModules();
		jest.doMock('./connection', () => ({
			__esModule: true,
			generateRefreshedCredential: () => { return {
				then: jest.fn((callback) => {
					callback({
						getAlbumTracks: dummyResponseErr,
						getAlbum: dummyResponse
					});
				})
			}}
		}));
	});
	test("Rejects on spotify error (album) (on tracks)", done => {
		const method = require("./searchSpotify").getSpotifyTracksByAlbum;

		expect.assertions(1);
		method(SAMPLE_DATA[1].id).catch((e: Error) => {
			expect(e).toStrictEqual(new Error(ERROR));
			done();
		});
	})
});

describe("Search methods fail", () => {

	beforeEach(() => {
		jest.resetModules();
		jest.doMock('./connection', () => ({
			__esModule: true,
			generateRefreshedCredential: () => { return {
				then: jest.fn((callback) => {
					callback({
						getArtistTopTracks: dummyResponseErr,
						getAlbumTracks: dummyResponseErr,
						getPlaylist: dummyResponseErr,
						getTracks: dummyResponseErr,
						searchTracks: dummyResponseErr,
						getAlbum: dummyResponseErr
					});
				})
			}}
		}));
	});

	test("Rejects on spotify error (search)", done => {
		const searchSpotifyM = require("./searchSpotify").default;
		expect.assertions(1);
		searchSpotifyM("Next Year").catch((e: Error) => {
			expect(e).toStrictEqual(new Error(ERROR));
			done();
		});
	})

	SAMPLE_DATA.forEach(data => {
		test(`Rejects on spotify error (${data.type})`, done => {
			const method = importMethod(data.type);

			expect.assertions(1);
			method(data.id).catch((e: Error) => {
				expect(e).toStrictEqual(new Error(ERROR));
				done();
			});
		});
	})
});


describe("Connection fails", () => {

	beforeEach(() => {
		jest.resetModules();
		jest.doMock('./connection', () => ({
			__esModule: true,
			generateRefreshedCredential: dummyResponseErr
		}));
	});

	test("Rejects on spotify error (search)", done => {
		const searchSpotifyM = require("./searchSpotify").default;
		expect.assertions(1);
		searchSpotifyM("Next Year").catch((e: Error) => {
			expect(e).toStrictEqual(new Error(ERROR));
			done();
		});
	})

	SAMPLE_DATA.forEach(data => {
		test(`Rejects on spotify error (${data.type})`, done => {
			const method = importMethod(data.type);

			expect.assertions(1);
			method(data.id).catch((e: Error) => {
				expect(e).toStrictEqual(new Error(ERROR));
				done();
			});
		});
	})
});
