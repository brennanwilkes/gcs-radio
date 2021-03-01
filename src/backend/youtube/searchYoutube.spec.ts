import {searchYoutubeDetailed, searchYoutubeSimple, itemIsVideo} from "./searchYoutube";
import ytsr from "ytsr";
import { mocked } from "ts-jest/utils";
import ytdl from "ytdl-core";
import { YoutubeResultFromApi } from "../../types/youtubeResult";

const query = "test";
const id = "d7pA7lWrN-4";
const invalid = "invalid";
const youtubeIdRegex = /^[0-9A-Za-z_-]{10}[048AEIMQUYcgkosw]$/;

const sampleData = {
	title: "testTitle",
	id: "d7pA7lWrN-4",
	bestThumbnail:{url:"testUrl"},
	type: "video"
};


const sampleResp = {
	videoDetails: {
		title: "testTitle",
		id: "testId",
		thumbnail: "testUrl"
	}
}

jest.mock('ytsr', () => ({
	__esModule: true,
	default: jest.fn((query) => {
		if(query === invalid){
			return new Promise((_resolve, reject) => {
				reject("error!");
			})
		}
		return new Promise((resolve, _reject) => {
			resolve({
				items: [
					sampleData,
					sampleData,
					sampleData,
					sampleData,
					sampleData,
					sampleData
				]
			});
		});
	})
}));

var getInfoReject = false;
jest.mock('ytdl-core', () => ({
	__esModule: true,
	getInfo: jest.fn((_url, _params) => {
		return new Promise((resolve, reject) => getInfoReject ? reject(new Error("err")) : resolve(sampleResp));
	})
}));

test("Items are correctly identified as Videos", () => {
	const vid = itemIsVideo({type:"video"} as ytsr.Item);
	const playlist = itemIsVideo({type:"playlist"} as ytsr.Item);
	expect(vid).toBeTruthy;
	expect(playlist).toBeFalsy;
});

test("Search simple calls ytsr and returns [limit] results", done => {
	const MockedYtsr = mocked(ytsr, true);
	const limit = 3;

	const res = searchYoutubeSimple(query, limit);
	expect(MockedYtsr).toHaveBeenCalledTimes(1);
	expect(MockedYtsr).toHaveBeenCalledWith(query, { limit: limit * 2 })
	res.then(resp => {
		expect(resp.length).toBe(limit);
		resp.forEach(item => {
			expect(item).toMatch(youtubeIdRegex);
		});
		done();
	})
});

test("Search Simple Rejects promise on errors", done => {
	const MockedYtsr = mocked(ytsr, true);

	const res = searchYoutubeSimple(invalid);
	expect(MockedYtsr).toHaveBeenCalledTimes(1);
	expect(MockedYtsr).toHaveBeenCalledWith(invalid, { limit: 10 })
	res.catch(error => {
		expect(error).toBe("error!");
		done();
	})
});

test("Search detailed returns youtube results from api", done => {
	searchYoutubeDetailed(id).then(res => {
		expect(res).toStrictEqual(new YoutubeResultFromApi(sampleResp as any));
		done();
	});
});
