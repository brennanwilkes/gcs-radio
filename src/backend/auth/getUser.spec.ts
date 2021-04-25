import { mocked } from "ts-jest/utils";
import { UserDoc } from "../../database/models/user";
import { UserFromDoc } from "../../types/user";
import {getUserFromId, getUserFromToken, getPasswordFromId, getUserIdFromToken, getUserFromTokenWithPassword} from "./getUser";

const id = "ID";
const pass = "PASSWORD";
let shouldErr = false;
let shouldInvalidData = false;
const err = new Error("ERROR");

const foundUser1 = {
	_id: id,
	username: "NAME",
	email: "EMAIL",
	type: "PASSWORD",
	password: pass,
	createdAt: new Date(),
	spotifyRefreshToken: "TOKEN",
	verifiedEmail: true
} as UserDoc;


const userFromToken = {
	user: {
		id: id
	}
}

jest.mock("../../database/models/user", () => ({
	findById: jest.fn().mockImplementation((_id: string) => {
		if(shouldErr){
			return Promise.reject(err);
		}
		else{
			if(shouldInvalidData){
				return Promise.resolve(undefined);
			}
			else{
				return Promise.resolve(foundUser1);
			}
		}
	})
}));

jest.mock("./signPayload", () => ({
	resolveSignedPayload: jest.fn().mockImplementation((_token: string) => {
		if(shouldErr){
			return Promise.reject(err);
		}
		else{
			if(shouldInvalidData){
				return Promise.resolve("userFromToken");
			}
			else{
				return Promise.resolve(userFromToken);
			}
		}
	})
}));

const mockedGetUserIdFromToken = mocked(getUserIdFromToken, true);
const mockedGetUserFromId = mocked(getUserFromId, true);
const mockedGetPasswordFromId = mocked(getPasswordFromId, true);
const mockedGetUserFromToken = mocked(getUserFromToken, true);
const mockedGetUserFromTokenWithPassword = mocked(getUserFromTokenWithPassword, true);

describe("getUserIdFromToken", () => {
	test("Extracts user ID from token", done => {
		shouldErr = false;
		shouldInvalidData = false;
		expect.assertions(1);
		mockedGetUserIdFromToken("TOKEN").then(foundId => {
			expect(foundId).toBe(id);
			done();
		});
	});
	test("Rejects on err", done => {
		shouldErr = true;
		shouldInvalidData = false;
		expect.assertions(1);
		mockedGetUserIdFromToken("TOKEN").catch(error => {
			expect(error).toStrictEqual(err);
			done();
		});
	});
	test("Rejects on invalid data", done => {
		shouldErr = false;
		shouldInvalidData = true;
		expect.assertions(1);
		mockedGetUserIdFromToken("TOKEN").catch(error => {
			expect(error).toStrictEqual(new Error("Authorization error"));
			done();
		});
	});
});

describe("getUserFromId", () => {
	test("Extracts user from token", done => {
		shouldErr = false;
		shouldInvalidData = false;
		expect.assertions(1);
		mockedGetUserFromId("TOKEN").then(user => {
			expect(user).toStrictEqual(new UserFromDoc(foundUser1));
			done();
		});
	});
	test("Rejects on err", done => {
		shouldErr = true;
		shouldInvalidData = false;
		expect.assertions(1);
		mockedGetUserFromId("TOKEN").catch(error => {
			expect(error).toStrictEqual(err);
			done();
		});
	});
	test("Rejects on invalid data", done => {
		shouldErr = false;
		shouldInvalidData = true;
		expect.assertions(1);
		mockedGetUserFromId("TOKEN").catch(error => {
			expect(error).toStrictEqual(new Error("User not found"));
			done();
		});
	});
});


describe("getPasswordFromId", () => {
	test("Extracts password from id", done => {
		shouldErr = false;
		shouldInvalidData = false;
		expect.assertions(1);
		mockedGetPasswordFromId(id).then(password => {
			expect(password).toBe(pass);
			done();
		});
	});
	test("Rejects on err", done => {
		shouldErr = true;
		shouldInvalidData = false;
		expect.assertions(1);
		mockedGetPasswordFromId(id).catch(error => {
			expect(error).toStrictEqual(err);
			done();
		});
	});
	test("Rejects on invalid data", done => {
		shouldErr = false;
		shouldInvalidData = true;
		expect.assertions(1);
		mockedGetPasswordFromId(id).catch(error => {
			expect(error).toStrictEqual(new Error("Password not found"));
			done();
		});
	});
});

describe("getUserFromToken", () => {
	test("Extracts user from token", done => {
		shouldErr = false;
		shouldInvalidData = false;
		expect.assertions(1);
		mockedGetUserFromToken("TOKEN").then(user => {
			expect(user).toStrictEqual(new UserFromDoc(foundUser1));
			done();
		});
	});
	test("Rejects on err", done => {
		shouldErr = true;
		shouldInvalidData = false;
		expect.assertions(1);
		mockedGetUserFromToken("TOKEN").catch(error => {
			expect(error).toStrictEqual(err);
			done();
		});
	});
});


describe("getUserFromTokenWithPassword", () => {
	test("Extracts user with password from token", done => {
		shouldErr = false;
		shouldInvalidData = false;
		expect.assertions(2);
		getUserFromTokenWithPassword("TOKEN").then(user => {
			expect(user).toStrictEqual({
				...(new UserFromDoc(foundUser1)),
				password: pass
			});
			expect(user?.password).toStrictEqual(pass);
			done();
		});
	});
	test("Rejects on err", done => {
		shouldErr = true;
		shouldInvalidData = false;
		expect.assertions(1);
		getUserFromTokenWithPassword("TOKEN").catch(error => {
			expect(error).toStrictEqual(err);
			done();
		});
	});
});
