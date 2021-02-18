// Brennan Wilkes

// Import and setup
import { mongoose } from "../connection";
import { VoiceLineRender as VoiceLineRenderType } from "../../types/voiceLine";
const Schema = mongoose.Schema;

const VoiceLineRenderSchema = new Schema({
	text: { type: String },
	type: { type: String },
	voice: { type: String },
	gender: { type: Number },
	audioId: { type: mongoose.Schema.Types.ObjectId, ref: "audio.files" }
});

export interface VoiceLineRenderDoc extends mongoose.Document {
	gender: number,
	text: string,
	type: string,
	voice: string,
	audioId: mongoose.Schema.Types.ObjectId,
}

const VoiceLineRender = mongoose.model<VoiceLineRenderDoc>("voiceLineRender", VoiceLineRenderSchema);
export default VoiceLineRender;

export function VoiceLineRenderModelFromVoiceLineRender (voiceLine: VoiceLineRenderType): InstanceType<typeof VoiceLineRender> {
	return new VoiceLineRender({
		text: voiceLine.text,
		type: voiceLine.type,
		voice: voiceLine.voice,
		gender: voiceLine.gender,
		audioId: voiceLine.audioId
	});
}

export { VoiceLineRenderSchema };
