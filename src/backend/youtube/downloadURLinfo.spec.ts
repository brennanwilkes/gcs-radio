import downloadURLinfo from "./downloadURLinfo";
import { mocked } from 'ts-jest/utils'
import VideoDataObj, {ThumbnailObj} from "../types/videoData";

const url = "TEST";
const errorStr = "error";
const sampleData = {
	upload_date : "20200203",
	duration : "1:00",
	fulltitle : "test fulltitle",
	album : "test albumn",
	title : "test title",
	id : "test id",
	tags : ["test tag"],
	track : "test track",
	thumbnails : [new ThumbnailObj("url",30,"resolution","id",30)],
	artist : "test artist"
}

const sampleOut = new VideoDataObj (
	"20200203",
	"1:00",
	"test fulltitle",
	"test albumn",
	"test title",
	"test id",
	["test tag"],
	"test track",
	[new ThumbnailObj("url",30,"resolution","id",30)],
	"test artist"
);

jest.mock("youtube-dl", () => { return {
	getInfo: jest.fn().mockImplementation((str: string, _arr: any[], callback: any) => {
		const resp = str === url ? {} : sampleData;
		callback(str===errorStr,resp);
	})
}});

const mockedDownload = mocked(downloadURLinfo, true);

test("Creates correct defaults", async (done) => {
	expect.assertions(20);
	mockedDownload(url).then(res => {
		expect(res).toHaveProperty("uploadDate");
		expect(res).toHaveProperty("duration");
		expect(res).toHaveProperty("fulltitle");
		expect(res).toHaveProperty("album");
		expect(res).toHaveProperty("title");
		expect(res).toHaveProperty("id");
		expect(res).toHaveProperty("tags");
		expect(res).toHaveProperty("track");
		expect(res).toHaveProperty("thumbnails");
		expect(res).toHaveProperty("artist");

		expect(res.uploadDate).toBe("20200202");
		expect(res.duration).toBe("0:00");
		expect(res.fulltitle).toBe("Unknown");
		expect(res.album).toBe("Unknown");
		expect(res.title).toBe("Unknown");
		expect(res.id).toBe("Unknown");
		expect(res.tags).toStrictEqual([]);
		expect(res.track).toBe("Unknown");
		expect(res.thumbnails).toStrictEqual([]);
		expect(res.artist).toBe("Unknown");
		done();
	});
});

test("Rejects promise on error", async (done) => {
	expect.assertions(1);
	mockedDownload(errorStr).catch(err => {
		expect(err).toBeTruthy();
		done();
	});
});

test("Returns correct information fields", async (done) => {
	expect.assertions(11);
	mockedDownload("").then(res => {
		expect(res).toHaveProperty("uploadDate");
		expect(res).toHaveProperty("duration");
		expect(res).toHaveProperty("fulltitle");
		expect(res).toHaveProperty("album");
		expect(res).toHaveProperty("title");
		expect(res).toHaveProperty("id");
		expect(res).toHaveProperty("tags");
		expect(res).toHaveProperty("track");
		expect(res).toHaveProperty("thumbnails");
		expect(res).toHaveProperty("artist");

		expect(res).toStrictEqual(sampleOut);
		done();
	});
});
