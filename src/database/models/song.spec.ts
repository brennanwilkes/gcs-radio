import { Song } from "../../types/song";
import { mongoose } from "../connection";
import { SongModelFromSong} from "./song";
const mongoIdRegex = /^[a-fA-F0-9]{24}$/;

beforeAll(done => {
	mongoose.connection.once("open", done);
});

test("Song model is created correctly", () => {
	expect(SongModelFromSong({} as Song).id).toMatch(mongoIdRegex);
});

afterAll(async () => {
	await mongoose.connection.close();
});
