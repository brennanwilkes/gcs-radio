import { mocked } from "ts-jest/utils";
import {CONFIG} from "../util/util";
import { google } from "googleapis";

import {getGoogleEnv, oath2FromCredentials, getTokenFromCode, getSignedTokenFromCode} from "./googleOauth";

const clientId = "ID";
const secret = "SECRET";
const redirect = "REDIRECT";

const OAuth2 = google.auth.OAuth2;

const mockedGetGoogleEnv = mocked(getGoogleEnv, true);
const mockedOath2FromCredentials = mocked(oath2FromCredentials, true);
const mockedGetTokenFromCode = mocked(getTokenFromCode, true);
const mockedGetSignedTokenFromCode = mocked(getSignedTokenFromCode, true);


describe("getGoogleEnv", () => {
	test("Returns auth pair", done => {
		CONFIG.googleClientId = clientId;
		CONFIG.googleClientSecret = secret;

		expect.assertions(2);
		mockedGetGoogleEnv().then(pair => {
			expect(pair.id).toBe(clientId);
			expect(pair.secret).toBe(secret);
			done();
		})
	});
	test("Rejects on missing credentials", done => {
		CONFIG.googleClientId = clientId;
		CONFIG.googleClientSecret = undefined;

		expect.assertions(2);
		mockedGetGoogleEnv().catch(err => {
			expect(err).toStrictEqual(new Error("Google OAUTH secret not set"));
			CONFIG.googleClientId = undefined;
			CONFIG.googleClientSecret = secret;
			mockedGetGoogleEnv().catch(err => {
				expect(err).toStrictEqual(new Error("Google OAUTH ID not set"));
				done();
			});
		});
	});
});

describe("oath2FromCredentials", () => {
	test("Returns oauth2 object", done => {
		CONFIG.googleClientId = clientId;
		CONFIG.googleClientSecret = secret;
		expect.assertions(1);
		mockedOath2FromCredentials(redirect).then(oauth => {
			expect(oauth).toStrictEqual(new OAuth2(clientId, secret, redirect))
			done();
		});
	});
	test("Rejects on error", done => {
		CONFIG.googleClientId = undefined;
		expect.assertions(1);
		mockedOath2FromCredentials(redirect).catch(err => {
			expect(err).toStrictEqual(new Error("Google OAUTH ID not set"));
			done();
		});
	});
});


describe("getTokenFromCode", () => {
	test("Rejects on error", done => {
		CONFIG.googleClientId = clientId;
		CONFIG.googleClientSecret = secret;
		expect.assertions(2);
		mockedGetTokenFromCode("code", redirect).catch(err => {
			expect(err).toBeTruthy();
			CONFIG.googleClientId = undefined;
			mockedGetTokenFromCode("code", redirect).catch(err => {
				expect(err).toBeTruthy();
				done();
			});
		});
	});
});

describe("getSignedTokenFromCode", () => {
	test("Rejects on error", done => {
		CONFIG.googleClientId = clientId;
		CONFIG.googleClientSecret = secret;
		expect.assertions(1);
		mockedGetSignedTokenFromCode("code", redirect).catch(err => {
			expect(err).toBeTruthy();
			done();
		});
	});
});
