/*

import downloadURLToStream from "./downloadURLToStream";
import dummyPipe from "../util/dummyPipe";
import youtubedl from "youtube-dl";
import { mocked } from "ts-jest/utils";
jest.mock("../util/dummyPipe", () => ({
	__esModule: true,
	default: jest.fn(() => {} )
}));

jest.mock('youtube-dl', () => ({
	__esModule: true,
	default: jest.fn(() => { return {
		pipe: jest.fn(_stdout => {})
	}})
}));

test("Calls youtubedl and returns a pipe with the output", () => {

	const MockedDummyPipe = mocked(dummyPipe, true);
	const MockedYoutubedl = mocked(youtubedl, true);

	const testPipe = dummyPipe();
	MockedDummyPipe.mockReturnValueOnce(testPipe);

	const downloadStream = downloadURLToStream("test");
	expect(MockedDummyPipe).toHaveBeenCalledTimes(2);
	expect(MockedYoutubedl).toHaveBeenCalledTimes(1);
	expect(downloadStream).toStrictEqual(testPipe);

});
*/
