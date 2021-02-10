import { Request, Response } from "express";
import internalErrorHandler from "../util/internalErrorHandler";
import { mongoose } from "../../database/connection";
import { print } from "../util/util";
import { SongObjFromQuery } from "../types/song";
import Song from "../../database/models/song";
import { Voice, VoiceLineTemplateObj, VoiceLineType } from "../types/voiceLine";
import { renderVoiceLineFromTemplate } from "../voice/renderVoiceLineFromTemplate";
import { recordVoiceLine } from "../voice/recordVoiceLine";
import streamToMongo from "../../database/streamToMongo";
import { VoiceLineRenderModelFromVoiceLineRender } from "../../database/models/voiceLineRender";
import { validateVoiceLine } from "../voice/validateVoiceLine";

const testingVoiceLine = new VoiceLineTemplateObj(
	[],
	"Welcome to GCS Radio",
	VoiceLineType.normal
);

const postVoiceLine = async (req: Request, res: Response) => {
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

		let template;
		do {
			// Pull template from database
			template = testingVoiceLine;
		}
		while (!validateVoiceLine(template, prevSong, nextSong));

		const render = renderVoiceLineFromTemplate(template, prevSong, nextSong, voice);
		print(`Rendered voice line "${render.text}"`);

		recordVoiceLine(render).then(output => {
			print(`Voice line recorded`);

			streamToMongo(`VoiceLine ${prevSong.title} -> ${nextSong.title} with ${voice}`, output).then(audioId => {
				print(`Audio Saved to database - ${audioId}`);

				render.audioId = audioId;
				VoiceLineRenderModelFromVoiceLineRender(render).save().then(resp => {
					print(`Saved audio to cache - ${resp._id}`);
					res.status(200).json(render);
					res.end();
				}).catch(errorHandler);
			}).catch(errorHandler);
		}).catch(errorHandler);
	}
};

export { postVoiceLine };
