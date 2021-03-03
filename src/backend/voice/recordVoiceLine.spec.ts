import { Voice, VoiceGender, VoiceLineRenderObj, VoiceLineType } from "../../types/voiceLine";
import {recordVoiceLine} from "./recordVoiceLine";

const streamData = "AUDIO CONTENT";
const textInput = "AUDIO TEXT";
var shouldErr = false;
var shouldNoResp = false;

const sythResp: any = {
	then: jest.fn((callback:any) => {
		if(!shouldErr){
			callback(shouldNoResp ? [] : [{
				audioContent: streamData
			}])
		}
		return sythResp;
	}),
	catch: jest.fn((callback: any) => callback(new Error("ERROR")))
}

jest.mock('@google-cloud/text-to-speech', () => ({
	__esModule: true,
	TextToSpeechClient: jest.fn(() => ({
		synthesizeSpeech: jest.fn().mockImplementation((request) => {

			expect(request.input.text).toBe(textInput);
			expect(request.voice.languageCode).toBe(`${split[0]}-${split[1]}`);
			expect(request.voice.name).toBe(Voice.DEFAULT as string);
			expect(request.voice.ssmlGender).toBe(VoiceGender.DEFAULT as number);

			return sythResp
		})
	})),
	protos: {google:{cloud:{texttospeech:{v1:{AudioEncoding:{LINEAR16:"LINEAR16"}}}}}}
}));



const render = new VoiceLineRenderObj(Voice.DEFAULT, VoiceGender.DEFAULT, textInput, VoiceLineType.normal);
const split = Voice.DEFAULT.split("-");

test("Returns a pipe with audio content", done => {
	expect.assertions(5);
	recordVoiceLine(render).then(res => {
		res.on("data", (data) => {
			expect(data.reduce((str: any, int: any) => str + String.fromCharCode(int), "")).toBe(streamData);
		});
		res.on("end",() => done());
	})
});

test("Rejects on empty content", done => {
	expect.assertions(5);
	shouldNoResp = true;
	recordVoiceLine(render).catch(err => {
		expect(err).toStrictEqual(new Error("Invalid audio content"));
		done();
	});
});

test("Rejects on errors", done => {
	expect.assertions(5);
	shouldErr = true;
	recordVoiceLine(render).catch(err => {
		expect(err).toStrictEqual(new Error("ERROR"));
		done();
	});
});
