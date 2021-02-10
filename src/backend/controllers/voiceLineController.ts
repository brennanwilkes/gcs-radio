import { Request, Response } from "express";
import internalErrorHandler from "../util/internalErrorHandler";
import { mongoose } from "../../database/connection";
import { print } from "../util/util";
import { SongObjFromQuery } from "../types/song";
import Song from "../../database/models/song";
import { Voice, VoiceLineRenderApiObj, VoiceLineRenderObjFromQuery } from "../types/voiceLine";
import { renderVoiceLineFromTemplate } from "../voice/renderVoiceLineFromTemplate";
import { recordVoiceLine } from "../voice/recordVoiceLine";
import streamToMongo from "../../database/streamToMongo";
import VoiceLineRenderModel, { VoiceLineRenderModelFromVoiceLineRender } from "../../database/models/voiceLineRender";
import selectVoiceLine from "../voice/selectVoiceLine";
import notFoundErrorHandler from "../util/notFoundErrorHandler";
import { PlayAudioLink, SelfLink } from "../types/link";

const getVoiceLine = (req: Request, res: Response): void => {
	const id = String(req.params.id);

	print(`Handling request for voice line resource ${id}`);

	VoiceLineRenderModel.findOne({ _id: new mongoose.Types.ObjectId(id) }).then(result => {
		if (result) {
			const render = new VoiceLineRenderObjFromQuery(result);
			res.send({
				voiceLines: [new VoiceLineRenderApiObj(render, [
					new PlayAudioLink(req, render),
					new SelfLink(req, result._id, "voiceLines")
				])]
			});
			res.end();
		} else {
			notFoundErrorHandler(req, res)("Voice Line", id);
		}
	}).catch(internalErrorHandler(req, res));
};

const postVoiceLine = async (req: Request, res: Response): Promise<void> => {
	const errorHandler = internalErrorHandler(req, res);

	const prevId = String(req.query.prevId);
	const nextId = String(req.query.nextId);
	const voice = (req.query.voice ?? Voice.DEFAULT) as Voice;

	const prevRes = await Song.findOne({ _id: new mongoose.Types.ObjectId(prevId) }).catch(errorHandler);
	const nextRes = await Song.findOne({ _id: new mongoose.Types.ObjectId(nextId) }).catch(errorHandler);
	if (nextRes && prevRes) {
		const prevSong = new SongObjFromQuery(prevRes);
		const nextSong = new SongObjFromQuery(nextRes);
		print(`Handling request for VoiceLine ${prevSong.title} -> ${nextSong.title} with ${voice}`);

		selectVoiceLine(prevSong, nextSong).then(template => {
			const render = renderVoiceLineFromTemplate(template, prevSong, nextSong, voice);
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

						streamToMongo(`VoiceLine ${prevSong.title} -> ${nextSong.title} with ${voice}`, output).then(audioId => {
							print(`Audio Saved to database - ${audioId}`);

							render.audioId = audioId;
							VoiceLineRenderModelFromVoiceLineRender(render).save().then(resp => {
								print(`Saved Voice line to cache - ${resp._id}`);
								res.status(200).json(render);
								res.end();
							}).catch(errorHandler);
						}).catch(errorHandler);
					}).catch(errorHandler);
				}
			}).catch(errorHandler);
		}).catch(errorHandler);
	}
};

export { postVoiceLine, getVoiceLine };
