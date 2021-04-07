import { mocked } from "ts-jest/utils";
import { CONFIG } from "../util/util";
import signPayload, {resolveSignedPayload} from "./signPayload";


const fakeToken = "TOKEN";
const error = "ERROR";

let shouldErr = false;
let shouldErrMessage = false;

jest.mock('jsonwebtoken', () => ({
	sign: jest.fn().mockImplementation((_id: any, _secret: string, callback: Function) => {
		if(shouldErr){
			callback(error);
		}
		else{
			callback(null, fakeToken);
		}
	}),
	verify: jest.fn().mockImplementation((_id: any, _secret: string, callback: Function) => {
		if(shouldErr){
			callback(error);
		}
		else{
			callback(null, fakeToken);
		}
	})
}));

const mockedSignPayload = mocked(signPayload, true);
const mockedResolveSignedPayload = mocked(resolveSignedPayload, true);

describe("signPayload", () => {
	test("signs a payload", done => {
		shouldErr = false;
		expect.assertions(1);
		mockedSignPayload("id").then(token => {
			expect(token).toBe(fakeToken);
			done();
		});
	});
	test("rejects on invalid config", done => {
		const cache = CONFIG.encryptionSecret;
		CONFIG.encryptionSecret = undefined;
		expect.assertions(1);
		mockedSignPayload("id").catch(err => {
			expect(err).toStrictEqual(new Error("Token secret not set"));
			CONFIG.encryptionSecret = cache;
			done();
		});
	});
	test("rejects on err", done => {
		shouldErr = true;
		expect.assertions(1);
		mockedSignPayload("id").catch(err => {
			expect(err).toBe(error);
			done();
		});
	});
});

describe("resolveSignedPayload", () => {
	test("resolves a payload", done => {
		shouldErr = false;
		expect.assertions(1);
		mockedResolveSignedPayload("id").then(token => {
			expect(token).toBe(fakeToken);
			done();
		});
	});
	test("rejects on invalid config", done => {
		const cache = CONFIG.encryptionSecret;
		CONFIG.encryptionSecret = undefined;
		expect.assertions(1);
		mockedResolveSignedPayload("id").catch(err => {
			expect(err).toStrictEqual(new Error("Token secret not set"));
			CONFIG.encryptionSecret = cache;
			done();
		});
	});
	test("rejects on err", done => {
		shouldErr = true;
		expect.assertions(1);
		mockedResolveSignedPayload("id").catch(err => {
			expect(err).toBe(error);
			done();
		});
	});
});
