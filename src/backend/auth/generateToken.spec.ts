import { mocked } from "ts-jest/utils";
import { CONFIG } from "../util/util";
import generateToken from "./generateToken";

interface firstArg{
	user: {
		id: string
	}
}
interface secondArg{
	expiresIn: number
}

const fakeToken = "TOKEN";
const error = {
	message: "ERROR"
};
const id = "ID";

let shouldErr = false;
let shouldErrMessage = false;

jest.mock('jsonwebtoken', () => ({
	sign: jest.fn().mockImplementation((_id: firstArg, _secret: string, _expiresIn: secondArg, callback: Function) => {
		if(shouldErr){
			callback(shouldErrMessage ? error : "error");
		}
		else{
			callback(null, fakeToken);
		}
	})
}));



const mockedGenerateToken = mocked(generateToken, true);

test("Generates a JSON Web Token", done => {
	shouldErr = false;
	expect.assertions(2);
	mockedGenerateToken(id).then(token => {
		expect(token).toBe(fakeToken);
		mockedGenerateToken(id, 400).then(token => {
			expect(token).toBe(fakeToken);
			done();
		});
	});
});
test("Rejects on error signal", done => {
	shouldErr = true;
	shouldErrMessage = true;
	expect.assertions(2);
	mockedGenerateToken(id).catch(err => {
		expect(err).toBe(error.message);
		shouldErrMessage = false;
		mockedGenerateToken(id).catch(err => {
			expect(err).toBe("Internal Error");
			done();
		});
	});
});
test("Rejects on invalid config", done => {
	expect.assertions(1);
	CONFIG.encryptionSecret = undefined;
	mockedGenerateToken(id).catch(err => {
		expect(err).toStrictEqual(new Error("Token secret not set"));
		done();
	});
});
