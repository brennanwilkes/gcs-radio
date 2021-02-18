// Brennan Wilkes

// Import and setup
import { mongoose } from "../connection";
import { VoiceLineTemplate as VoiceLineTemplateType } from "../../types/voiceLine";
const Schema = mongoose.Schema;

const VoiceLineTemplateSchema = new Schema({
	text: { type: String },
	type: { type: String },
	conditions: [{
		appliesTo: { type: Number },
		variable: { type: String },
		condition: { type: String },
		operand: { type: String }
	}]
});

export interface VoiceLineTemplateDoc extends mongoose.Document {
	text: string,
	type: string,
	conditions: {
		appliesTo: number,
		variable: string,
		condition: string,
		operand: string
	}[]
}

const VoiceLineTemplate = mongoose.model<VoiceLineTemplateDoc>("voiceLineTemplate", VoiceLineTemplateSchema);
export default VoiceLineTemplate;

export function VoiceLineTemplateModelFromVoiceLineTemplate (voiceLine: VoiceLineTemplateType): InstanceType<typeof VoiceLineTemplate> {
	return new VoiceLineTemplate({
		text: voiceLine.text,
		type: voiceLine.type,
		conditions: voiceLine.conditions
	});
}

export { VoiceLineTemplateSchema };
