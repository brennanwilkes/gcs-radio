import streamVidToAudio from "./streamVidToAudio";
import { mocked } from 'ts-jest/utils'

const mockFfmpegWriteToStream = jest.fn();
const mockFfmpegOn = jest.fn().mockImplementation(() => { return {
	writeToStream: mockFfmpegWriteToStream
}});
const mockFfmpegToFormat = jest.fn().mockImplementation(() => { return {
	on: mockFfmpegOn
}});
jest.mock("fluent-ffmpeg", () => {
	return jest.fn().mockImplementation(() => { return {
		toFormat: mockFfmpegToFormat
	}});
});

const mockedStreamVidToAudio = mocked(streamVidToAudio, true)

test("Converts Video to mp3 with ffmpeg", () => {
	mockedStreamVidToAudio(process.stdin, process.stdout);
	expect(mockFfmpegToFormat).toHaveBeenCalledWith("mp3");
	expect(mockFfmpegOn).toHaveBeenCalledWith("error", expect.any(Function));
	expect(mockFfmpegWriteToStream).toHaveBeenCalledWith(process.stdout);
});
