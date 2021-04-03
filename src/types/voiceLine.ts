import { VoiceLineRenderDoc } from "../database/models/voiceLineRender";
import { protos } from "@google-cloud/text-to-speech";
import { VoiceLineTemplateDoc } from "../database/models/voiceLineTemplate";
import { Link } from "./link";

/* eslint-disable no-unused-vars */
export enum ConditionType{
	EQUALS_CONST = "===",
	EQUALS_VAR = "==",
	EXISTS = "!"
}

export enum ConditionAppliesTo{
	PREVIOUS = 0,
	NEXT = 1,
}

export enum VoiceLineType{
	normal = "NORMAL",
	parallel = "PARALLEL",
	intro = "INTRO",
	api = "API",
	rss = api
}

export enum Voice{
	enUsB = "en-US-Wavenet-B",
	enUsD = "en-US-Wavenet-D",
	enInC = "en-IN-Wavenet-C",
	enAuB = "en-AU-Wavenet-B",
	enAuC = "en-AU-Wavenet-C",
	enGbF = "en-GB-Wavenet-F",
	enGbB = "en-GB-Wavenet-B",
	enGbD = "en-GB-Wavenet-D",
	deDeB = "de-DE-Wavenet-B",
	frFrA = "fr-FR-Wavenet-A",
	itItD = "it-IT-Wavenet-D",
	jaJpD = "ja-JP-Wavenet-D",
	nbNoC = "nb-NO-Wavenet-C",
	ptPtB = "pt-PT-Wavenet-B",
	svSeA = "sv-SE-Wavenet-A",
	cmnCnA = "cmn-CN-Wavenet-A",
	DEFAULT = enAuB
}

export enum VoiceGender{
	MALE = protos.google.cloud.texttospeech.v1.SsmlVoiceGender.MALE,
	FEMALE = protos.google.cloud.texttospeech.v1.SsmlVoiceGender.FEMALE,
	NEUTRAL = protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
	DEFAULT = protos.google.cloud.texttospeech.v1.SsmlVoiceGender.SSML_VOICE_GENDER_UNSPECIFIED,
}

export enum VoiceVariable{
	title = "title",
	artist = "artist",
	albumn = "album",
	releaseDate = "releaseDate",
	playlist = "playlist"
}

/* eslint-enable no-unused-vars */

export interface VoiceCondition{
	appliesTo: ConditionAppliesTo,
	variable: VoiceVariable,
	condition: ConditionType,
	operand?: Exclude<VoiceVariable, VoiceVariable.playlist> | string
}

export class VoiceConditionObj implements VoiceCondition {
	appliesTo: ConditionAppliesTo;
	variable: VoiceVariable;
	condition: ConditionType;
	operand?: VoiceVariable | string;

	constructor (appliesTo: ConditionAppliesTo, variable: VoiceVariable, condition: ConditionType, operand?: VoiceVariable | string) {
		this.appliesTo = appliesTo;
		this.variable = variable;
		this.condition = condition;
		if (operand) {
			this.operand = operand;
		}
	}
}

export interface VoiceLine{
	text: string,
	type: VoiceLineType,
}

export class VoiceLineObj implements VoiceLine {
	text: string;
	type: VoiceLineType;
	constructor (text: string, type: VoiceLineType) {
		this.text = text;
		this.type = type;
	}
}

export interface VoiceLineTemplate extends VoiceLine{
	conditions: VoiceCondition[]
}

export class VoiceLineTemplateObj extends VoiceLineObj implements VoiceLineTemplate {
	conditions: VoiceCondition[];
	constructor (conditions: VoiceCondition[], text: string, type: VoiceLineType = VoiceLineType.normal) {
		super(text, type);
		this.conditions = conditions;
	}
}

export class VoiceLineTemplateAutofill extends VoiceLineTemplateObj {
	constructor (conditions: VoiceCondition[], text: string, type: VoiceLineType = VoiceLineType.normal) {
		const auto: VoiceCondition[] = conditions;

		["PREV", "NEXT"].forEach((prefix: string, i: number) => {
			if (text.includes(`$${prefix}_TITLE`)) auto.push(new VoiceConditionObj(i, VoiceVariable.title, ConditionType.EXISTS));
			if (text.includes(`$${prefix}_ARTIST`)) auto.push(new VoiceConditionObj(i, VoiceVariable.artist, ConditionType.EXISTS));
			if (text.includes(`$${prefix}_ALBUM`)) auto.push(new VoiceConditionObj(i, VoiceVariable.albumn, ConditionType.EXISTS));
			if (text.includes(`$${prefix}_RELEASE_DATE`)) auto.push(new VoiceConditionObj(i, VoiceVariable.releaseDate, ConditionType.EXISTS));
		});

		if (text.includes(`$PLAYLIST_TITLE`) || text.includes(`$PLAYLIST_DESCRIPTION`)) auto.push(new VoiceConditionObj(0, VoiceVariable.playlist, ConditionType.EXISTS));

		super(auto, text, type);
	}
}

export interface VoiceLineRender extends VoiceLine{
	audioId?: string,
	voice: Voice
	gender: VoiceGender
}

export class VoiceLineRenderObj extends VoiceLineObj implements VoiceLineRender {
	audioId?: string;
	voice: Voice;
	gender: VoiceGender;
	constructor (voice: Voice, gender: VoiceGender, text: string, type: VoiceLineType, audioId?: string) {
		super(text, type);
		if (audioId) {
			this.audioId = audioId;
		}
		this.voice = voice;
		this.gender = gender;
	}
}

export class VoiceLineRenderObjFromQuery extends VoiceLineRenderObj {
	constructor (results: VoiceLineRenderDoc) {
		super(
			results.voice as Voice,
			results.gender as VoiceGender,
			results.text,
			results.type as VoiceLineType,
			String(results.audioId)
		);
	}
}

export class VoiceLineTemplateObjFromQuery extends VoiceLineTemplateObj {
	constructor (results: VoiceLineTemplateDoc) {
		super(
			results.conditions.map(cond => new VoiceConditionObj(
				cond.appliesTo,
				cond.variable as VoiceVariable,
				cond.condition as ConditionType,
				cond.operand
			)),
			results.text,
			results.type as VoiceLineType
		);
	}
}

export interface VoiceLineRenderApi extends VoiceLineRender{
	links: Link[]
}

export class VoiceLineRenderApiObj extends VoiceLineRenderObj implements VoiceLineRenderApi {
	links: Link[]
	constructor (base: VoiceLineRender, links: Link[]) {
		super(
			base.voice,
			base.gender,
			base.text,
			base.type,
			base.audioId
		);
		this.links = links;
	}
}
