// Brennan Wilkes

import SpotifyWebApi from "spotify-web-api-node";
const TOKEN = "TOKEN";
const ERROR = "ERROR";

var shouldErr = false;
const clientCredentialsGrantMock = jest.fn().mockImplementation(() => {
	return {
		then: jest.fn((resolve, reject) => {
			if(shouldErr){
				reject(ERROR);
			}
			else{
				resolve({
					body: {
						access_token: TOKEN
					}
				});
			}
		})
	};
});

const setAccessTokenMock = jest.fn(() => {});

jest.mock('spotify-web-api-node', () => ({
	__esModule: true,
	default: jest.fn((_options) => {
		return {
			clientCredentialsGrant: clientCredentialsGrantMock,
			setAccessToken: setAccessTokenMock
		}
	})
}));



const SPOTIFY_ID = process.env.SPOTIFY_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;

process.env.SPOTIFY_ID = "";
process.env.SPOTIFY_SECRET = "";

afterEach(() => {
	process.env.SPOTIFY_ID = SPOTIFY_ID;
	process.env.SPOTIFY_SECRET = SPOTIFY_SECRET;
})

beforeEach(() => {
	jest.resetModules();
});


test("Rejects on no credentials", done => {

	const customConnection: Promise<SpotifyWebApi> = require("./connection").default;

	expect.assertions(1);
	customConnection.catch(e => {
		expect(e).toStrictEqual(new Error("No spotify credentials detected"));
		done();
	})
});


test("Connects with spotify-web-api-node", done => {
	expect.assertions(3);

	const connection: Promise<SpotifyWebApi> = require("./connection").default;
	connection.then(res => {
		expect(clientCredentialsGrantMock).toHaveBeenCalledTimes(1);
		expect(setAccessTokenMock).toHaveBeenCalledTimes(1);
		expect(setAccessTokenMock).toHaveBeenCalledWith(TOKEN);
		done();
	});
});

test("Rejects on error event", done => {
	expect.assertions(1);
	shouldErr = true;

	const connection: Promise<SpotifyWebApi> = require("./connection").default;
	connection.catch(err => {
		expect(err).toStrictEqual(new Error(ERROR));
		done();
	});
});
