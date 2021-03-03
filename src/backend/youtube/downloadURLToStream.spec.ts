

import downloadURLToStream from "./downloadURLToStream";
import dummyPipe from "../util/dummyPipe";
import ytdl from "ytdl-core";
import { mocked } from "ts-jest/utils";
import cookie from "../util/cookies";

jest.mock("../util/dummyPipe", () => ({
	__esModule: true,
	default: jest.fn(() => {} )
}));

interface mockYtdlInterface  {
	pipe: any
	on: any
}

var onErr = false;

const mockYtdlObj: mockYtdlInterface = {
	pipe: jest.fn(_stdout => {}),
	on: jest.fn((_event: string, callback: any) => onErr ? callback("ERROR") : mockYtdlObj)
};

jest.mock('ytdl-core', () => ({
	__esModule: true,
	default: jest.fn(() => {return mockYtdlObj}),
	filterFormats: jest.fn(arr => arr.length > 1 ? [] : arr)
}));

test("Rejects when no formats available", done => {
	expect.assertions(1);
	downloadURLToStream("test", []).catch(e => {
		expect(e).toEqual(new Error('No videoFormats available!'));
		done();
	});
});

test("Calls ytdl with audio formats and returns a pipe with the output", done => {
	const MockedDummyPipe = mocked(dummyPipe, true);
	const MockedYoutubedl = mocked(ytdl, true);

	const testPipe = dummyPipe();
	MockedDummyPipe.mockReturnValueOnce(testPipe);

	downloadURLToStream("test", [{} as ytdl.videoFormat]).then(downloadStream => {
		expect(MockedDummyPipe).toHaveBeenCalledTimes(2);
		expect(MockedYoutubedl).toHaveBeenCalledTimes(1);
		expect(MockedYoutubedl).toHaveBeenCalledWith("test",{
			quality: "highestaudio",
			...cookie
		});
		expect(downloadStream).toStrictEqual(testPipe);
		done();
	});
});


test("Calls ytdl with video formats and returns a pipe with the output", done => {

	const MockedDummyPipe = mocked(dummyPipe, true);
	const MockedYoutubedl = mocked(ytdl, true);

	const testPipe = dummyPipe();
	MockedDummyPipe.mockReturnValueOnce(testPipe);

	downloadURLToStream("test", [{} as ytdl.videoFormat, {} as ytdl.videoFormat]).then(downloadStream => {
		expect(MockedDummyPipe).toHaveBeenCalledTimes(2);
		expect(MockedYoutubedl).toHaveBeenCalledTimes(1);
		expect(MockedYoutubedl).toHaveBeenCalledWith("test",{
			quality: "lowestvideo",
			...cookie
		});
		expect(downloadStream).toStrictEqual(testPipe);
		done();
	});
});

test("Promise rejects on error events", done => {
	expect.assertions(1);
	onErr = true;
	downloadURLToStream("test", [{} as ytdl.videoFormat]).catch(e => {
		expect(e).toEqual("ERROR");
		done();
	});
});
