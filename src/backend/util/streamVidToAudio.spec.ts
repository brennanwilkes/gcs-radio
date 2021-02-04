import streamVidToAudio from "./streamVidToAudio";
import { mocked } from "ts-jest/utils";

var shouldMockError = false;

const mockFfmpegWriteToStream = jest.fn();
const mockFfmpegOn = jest.fn().mockImplementation((_md:string, callback: Function) => {
	if(shouldMockError){
		callback("internal test error")
	}
	return {
		writeToStream: mockFfmpegWriteToStream
	};
});
const mockFfmpegToFormat = jest.fn().mockImplementation(() => {
	return {
		on: mockFfmpegOn
	};
});
jest.mock("fluent-ffmpeg", () => {
	return jest.fn().mockImplementation(() => {
		return {
			toFormat: mockFfmpegToFormat
		};
	});
});

const mockedStreamVidToAudio = mocked(streamVidToAudio, true);

test("Converts Video to mp3 with ffmpeg", () => {
	shouldMockError = false;
	mockedStreamVidToAudio(process.stdin, process.stdout);
	expect(mockFfmpegToFormat).toHaveBeenCalledWith("mp3");
	expect(mockFfmpegOn).toHaveBeenCalledWith("error", expect.any(Function));
	expect(mockFfmpegWriteToStream).toHaveBeenCalledWith(process.stdout);
});
test("Rejects on error signal", async (done) => {
	expect.assertions(1);

	shouldMockError = true;
	mockedStreamVidToAudio(process.stdin, process.stdout).catch(err => {
		expect(err).toBeTruthy();
		done();
	})
});
