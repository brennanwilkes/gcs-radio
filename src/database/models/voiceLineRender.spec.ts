import { mongoose } from "../connection";
import { VoiceLineRenderModelFromVoiceLineRender } from "./voiceLineRender";
import { VoiceLineRender as VoiceLineRenderType } from "../../types/voiceLine";
const mongoIdRegex = /^[a-fA-F0-9]{24}$/;

beforeAll(done => {
	mongoose.connection.once("open", done);
});

test("Voice Line Render model is created correctly", () => {
	expect(VoiceLineRenderModelFromVoiceLineRender({} as VoiceLineRenderType).id).toMatch(mongoIdRegex);
});

afterAll(async () => {
	await mongoose.connection.close();
});
