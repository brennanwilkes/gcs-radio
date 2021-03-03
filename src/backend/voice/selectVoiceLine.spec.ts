import { Song } from "../../types/song";
import { VoiceLineTemplate, VoiceLineType } from "../../types/voiceLine";
import selectVoiceLine, {selectFirstVoiceLine} from "./selectVoiceLine";
import { validateVoiceLine } from "./validateVoiceLine";
import {connection} from "../../database/connection";

const song1 = {} as Song;
const song2 = {} as Song;

var first = true;
const validatorMock = jest.fn().mockImplementation((_t: VoiceLineTemplate, _a: Song, _b: Song): boolean => first = !first);
jest.mock("./validateVoiceLine", () => ({
	__esModule: true,
	validateVoiceLine: (a:any,b:any,c:any) => validatorMock(a,b,c)
}));

test("Finds valid regular voice line", done => {
	expect.assertions(4);
	selectVoiceLine(song1, song2).then(res => {
		expect(validatorMock).toHaveBeenCalledTimes(2);
		expect(validatorMock).toBeCalledWith(res, song1, song2);
		expect(res.type === VoiceLineType.intro).toBeFalsy();
		first = false;
		expect(validateVoiceLine(res, song1, song2)).toBeTruthy();
		done();
	});
});

test("Finds intro voice line", done => {
	expect.assertions(2);
	selectFirstVoiceLine().then(res => {
		expect(res.type === VoiceLineType.intro).toBeTruthy();
		first = false;
		expect(validateVoiceLine(res, song1, song2)).toBeTruthy();
		done();
	});
});

afterAll(() => {
	connection.then(con => con.connection.close());
});
