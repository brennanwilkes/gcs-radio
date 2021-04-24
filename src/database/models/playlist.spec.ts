import { mongoose } from "../connection";
import PlaylistModel, { PlaylistObjFromQuery, PlaylistModelFromPlaylist} from "./playlist";
const mongoIdRegex = /^[a-fA-F0-9]{24}$/;

var shouldErr = false;
var shouldEmpty = false;

beforeAll(done => {
	mongoose.connection.once("open", done);
});

test("Playlist model follows spec", () => {
	const playlistModel = new PlaylistModel();
	expect(playlistModel.songs.length).toBe(0);
	expect(String(playlistModel._id)).toMatch(mongoIdRegex);
});

test("Playlist Model is correctly initialized from playlist type", () => {
	expect.assertions(5);
	PlaylistModelFromPlaylist({
		songs: {
			filter: (callback: any) => {
				expect(callback({id:"ID"})).toBeTruthy();
				expect(callback({})).toBeFalsy();
				expect(callback).toStrictEqual(expect.any(Function));
				return {
					map: (callback: any) => {
						expect(callback).toStrictEqual(expect.any(Function));
						expect(callback({id:"ID"})).toStrictEqual(new mongoose.Schema.Types.ObjectId("ID"));
						return [];
					}
				};
			}
		}
	} as any);
});

const fakeSongs = {
	filter: () => fakeSongs,
	map: () => {
		if(shouldEmpty){
			return [];
		}
		return [
			new Promise((resolve, reject) => {
				if(shouldErr){
					reject("ERROR");
				}
				else{
					resolve(1);
				}
			})
		]
	}
}

const queryResults = {
	songs: fakeSongs,
	features: fakeSongs
};

test("Playlist from Query extracts data", done => {
	shouldErr = false;
	shouldEmpty = false;
	const res = PlaylistObjFromQuery(queryResults as any);
	expect(res).toMatchObject({
		songs: expect.any(Array),
		id: expect.any(String)
	});
	done();
});

test("Playlist from Query rejects on no results", done => {
	shouldErr = false;
	shouldEmpty = true;
	const err = PlaylistObjFromQuery(queryResults as any);
	expect(err).toBeTruthy();
	done();
});

afterAll(async () => {
	await mongoose.connection.close();
});
