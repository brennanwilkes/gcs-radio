import { Request, Response } from "express";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { mongoose } from "../../../database/connection";
import { print } from "../../util/util";
import { VoiceLineRenderApiObj, VoiceLineRenderObjFromQuery } from "../../../types/voiceLine";
import VoiceLineRenderModel from "../../../database/models/voiceLineRender";
import notFoundErrorHandler from "../../errorHandlers/notFoundErrorHandler";
import { PlayAudioLink, SelfLink } from "../../../types/link";

export default (req: Request, res: Response): void => {
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
