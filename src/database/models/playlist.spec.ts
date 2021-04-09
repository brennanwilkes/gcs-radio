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

const queryResults = {
	songs: {
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
};

test("Playlist from Query extracts data", done => {
	shouldErr = false;
	shouldEmpty = false;
	PlaylistObjFromQuery(queryResults as any).then(res => {
		expect(res).toMatchObject({
			songs: expect.any(Array),
			id: expect.any(String)
		});
		done();
	});
});


test("Playlist from Query rejects on error", done => {
	shouldErr = true;
	shouldEmpty = false;
	PlaylistObjFromQuery(queryResults as any).catch(err => {
		expect(err).toBe("ERROR");
		done();
	});
});


test("Playlist from Query rejects on no results", done => {
	shouldErr = false;
	shouldEmpty = true;
	PlaylistObjFromQuery(queryResults as any).catch(err => {
		expect(err).toBeTruthy();
		done();
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
