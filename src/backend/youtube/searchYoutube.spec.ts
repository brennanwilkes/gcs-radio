
import searchYoutube from "./searchYoutube";
import ytsr, {Result} from "ytsr";
import { mocked } from "ts-jest/utils";

const query = "test";
const invalid = "invalid";

const sampleData = {
	title: "testTitle",
	id: "testId",
	bestThumbnail:{url:"testUrl"},
	type: "video"
};

const sampleResp = {
	title: "testTitle",
	id: "testId",
	thumbnail: "testUrl"
}

jest.mock('ytsr', () => ({
	__esModule: true,
	default: jest.fn((query) => {
		if(query === invalid){
			return new Promise((resolve, reject) => {
				reject("error!");
			})
		}
		return new Promise((resolve, reject) => {
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

test("Calls ytsr and returns no more than 5 Search Results", async (done) => {

	const MockedYtsr = mocked(ytsr, true);

	const res = searchYoutube(query);
	expect(MockedYtsr).toHaveBeenCalledTimes(1);
	expect(MockedYtsr).toHaveBeenCalledWith(query, { limit: 15 })
	res.then(resp => {
		expect(resp.length).toBe(5);
		resp.forEach(item => {
			Object.keys(sampleResp).forEach(key => {
				expect(item).toHaveProperty(key);
			});
		});
		done();
	})
});
test("Rejects promise on errors", async (done) => {
	const MockedYtsr = mocked(ytsr, true);

	const res = searchYoutube(invalid);
	expect(MockedYtsr).toHaveBeenCalledTimes(1);
	expect(MockedYtsr).toHaveBeenCalledWith(invalid, { limit: 15 })
	res.catch(error => {
		expect(error).toBe("error!");
		done();
	})
});
