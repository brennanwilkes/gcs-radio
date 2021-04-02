import { Request, Response } from "express";
import { print } from "../../util/util";
import { VoiceLineRender, VoiceLineRenderApiObj } from "../../../types/voiceLine";
import { recordVoiceLine } from "../../voice/recordVoiceLine";
import streamToMongo from "../../../database/streamToMongo";
import VoiceLineRenderModel, { VoiceLineRenderModelFromVoiceLineRender } from "../../../database/models/voiceLineRender";
import { PlayAudioLink, SelfLink } from "../../../types/link";

export default (render: VoiceLineRender, req: Request, res: Response, errorHandler:((err: string) => void), message: string) => {
	print(`Rendered voice line "${render.text}"`);

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

				streamToMongo(message, output).then(audioId => {
					print(`Audio Saved to database - ${audioId}`);

					render.audioId = audioId;
					VoiceLineRenderModelFromVoiceLineRender(render).save().then(resp => {
						print(`Saved Voice line to cache - ${resp._id}`);
						res.status(200).send({
							voiceLines: [new VoiceLineRenderApiObj(render, [
								new PlayAudioLink(req, render),
								new SelfLink(req, resp._id, "voiceLines")
							])]
						});
						res.end();
					}).catch(errorHandler);
				}).catch(errorHandler);
			}).catch(errorHandler);
		}
	}).catch(errorHandler);
};
