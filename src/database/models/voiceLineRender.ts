// Brennan Wilkes

// Import and setup
import { mongoose } from "../connection";
import { VoiceLineRender as VoiceLineRenderType } from "../../backend/types/voiceLine";
const Schema = mongoose.Schema;

const VoiceLineRenderSchema = new Schema({
	text: { type: String },
	type: { type: String },
	voice: { type: String },
	gender: { type: Number },
	/* conditions: [{
		appliesTo: { type: Number },
		variable: { type: String },
		condition: { type: String },
		operand: { type: String }
	}],
	*/
	audioId: { type: mongoose.Schema.Types.ObjectId, ref: "voiceLines.files" }
});

export interface VoiceLineRenderDoc extends mongoose.Document {
	gender: number,
	text: string,
	type: string,
	voice: string,
	audioId: mongoose.Schema.Types.ObjectId,
	/*
	conditions: {
		appliesTo: number,
		variable: string,
		condition: string,
		operand: string
	}[]
	*/
}

const VoiceLineRender = mongoose.model<VoiceLineRenderDoc>("voiceLine", VoiceLineRenderSchema);
export default VoiceLineRender;

export function VoiceLineRenderModelFromVoiceLineRender (voiceLine: VoiceLineRenderType): InstanceType<typeof VoiceLineRender> {
	return new VoiceLineRender({
		text: voiceLine.text,
		type: voiceLine.type,
		voice: voiceLine.voice,
		gender: voiceLine.gender,
		audioId: voiceLine.audioId
		// conditions: voiceLine.conditions
	});
}

export { VoiceLineRenderSchema };
