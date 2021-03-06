import { Request, Response } from "express";
import { print } from "../../util/util";
import { VoiceLineRender, VoiceLineRenderApiObj } from "../../../types/voiceLine";
import { recordVoiceLine } from "../../voice/recordVoiceLine";
import streamToMongo from "../../../database/streamToMongo";
import VoiceLineRenderModel, { VoiceLineRenderModelFromVoiceLineRender } from "../../../database/models/voiceLineRender";
import { PlayAudioLink, SelfLink } from "../../../types/link";
import translateVoiceLine from "../../voice/translateVoiceLine";

export default (render: VoiceLineRender, req: Request, res: Response, errorHandler:((err: string) => void), message: string): void => {
	print(`Rendered voice line "${render.text}"`);

	translateVoiceLine(render).then(render => {
		// Ensure not to re-render an existing voiceline
		// Saves money with the Google Text to Speech API
		VoiceLineRenderModel.findOne({
			text: render.text,
			type: render.type,
			voice: render.voice,
			gender: render.gender
		}).then(result => {
			if (result) {
				print(`Redirecting to existing cache ${String(result.id)}`);
				res.redirect(303, `${req.baseUrl}/voiceLines/${String(result._id)}`);
			} else {
				recordVoiceLine(render).then(output => {
					print(`Voice line recorded`);
					return streamToMongo(message, output);
				}).then(audioId => {
					print(`Audio Saved to database - ${audioId}`);
					render.audioId = audioId;
					return VoiceLineRenderModelFromVoiceLineRender(render).save();
				}).then(resp => {
					print(`Saved Voice line to cache - ${resp._id}`);
					res.status(200).send({

						// Apply HATEOAS links
						voiceLines: [new VoiceLineRenderApiObj(render, [
							new PlayAudioLink(req, render),
							new SelfLink(req, resp._id, "voiceLines")
						], String(resp._id))]
					});
					res.end();
				}).catch(errorHandler);
			}
		}).catch(errorHandler);
	}).catch(errorHandler);
};
