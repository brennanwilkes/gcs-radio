import { Request, Response } from "express";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import { mongoose } from "../../database/connection";
import { print } from "../util/util";
import { SongObjFromQuery } from "../../types/song";
import Song from "../../database/models/song";
import { Voice, VoiceGender, VoiceLineRender, VoiceLineRenderApiObj, VoiceLineRenderObjFromQuery } from "../../types/voiceLine";
import { renderVoiceLineFromTemplate } from "../voice/renderVoiceLineFromTemplate";
import { recordVoiceLine } from "../voice/recordVoiceLine";
import streamToMongo from "../../database/streamToMongo";
import VoiceLineRenderModel, { VoiceLineRenderModelFromVoiceLineRender } from "../../database/models/voiceLineRender";
import selectVoiceLine, { selectFirstVoiceLine } from "../voice/selectVoiceLine";
import notFoundErrorHandler from "../errorHandlers/notFoundErrorHandler";
import { PlayAudioLink, SelfLink } from "../../types/link";

const uploadVoiceLine = (render: VoiceLineRender, req: Request, res: Response, errorHandler:((err: string) => void), message: string) => {
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

const postFirstVoiceLine = async (req: Request, res: Response): Promise<void> => {
	const errorHandler = internalErrorHandler(req, res);

	const id = String(req.query.firstId);
	const voice = (req.query.voice ?? Voice.DEFAULT) as Voice;

	const songRes = await Song.findOne({ _id: new mongoose.Types.ObjectId(id) }).catch(errorHandler);
	if (songRes) {
		const song = new SongObjFromQuery(songRes);
		print(`Handling request for first VoiceLine ${song.title} with ${voice}`);

		selectFirstVoiceLine().then(template => {
			const render = renderVoiceLineFromTemplate(template, song, song, voice);
			uploadVoiceLine(render, req, res, errorHandler, `first VoiceLine ${song.title} with ${voice}`);
		}).catch(errorHandler);
	}
};

const postRegularVoiceLine = async (req: Request, res: Response): Promise<void> => {
	const errorHandler = internalErrorHandler(req, res);

	const hasSpotify = (!!req.cookies.sat) && (!!req.cookies.srt);

	const prevId = String(req.query.prevId);
	const nextId = String(req.query.nextId);
	const voice = (req.query.voice ?? Voice.DEFAULT) as Voice;
	const gender = (req.query.gender ?? VoiceGender.DEFAULT) as VoiceGender;

	const prevRes = await Song.findOne({ _id: new mongoose.Types.ObjectId(prevId) }).catch(errorHandler);
	const nextRes = await Song.findOne({ _id: new mongoose.Types.ObjectId(nextId) }).catch(errorHandler);
	if (nextRes && prevRes) {
		const prevSong = new SongObjFromQuery(prevRes);
		const nextSong = new SongObjFromQuery(nextRes);
		print(`Handling request for VoiceLine ${prevSong.title} -> ${nextSong.title} with ${voice}`);

		selectVoiceLine(prevSong, nextSong, hasSpotify).then(template => {
			const render = renderVoiceLineFromTemplate(template, prevSong, nextSong, voice, gender);
			uploadVoiceLine(render, req, res, errorHandler, `VoiceLine ${prevSong.title} -> ${nextSong.title} with ${voice}`);
		}).catch(errorHandler);
	}
};

const postVoiceLine = async (req: Request, res: Response): Promise<void> => {
	if (req.query.firstId) {
		postFirstVoiceLine(req, res);
	} else {
		postRegularVoiceLine(req, res);
	}
};

export { postVoiceLine, getVoiceLine };
