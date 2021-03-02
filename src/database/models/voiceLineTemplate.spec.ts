import { mongoose } from "../connection";
import { VoiceLineTemplateModelFromVoiceLineTemplate } from "./voiceLineTemplate";
import { VoiceLineTemplate as VoiceLineTemplateType } from "../../types/voiceLine";
const mongoIdRegex = /^[a-fA-F0-9]{24}$/;

beforeAll(done => {
	mongoose.connection.once("open", done);
});

test("Voice Line Template model is created correctly", () => {
	expect(VoiceLineTemplateModelFromVoiceLineTemplate({} as VoiceLineTemplateType).id).toMatch(mongoIdRegex);
});

afterAll(async () => {
	await mongoose.connection.close();
});
