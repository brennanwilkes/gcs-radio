import { Request, Response } from "express";

import { Voice, VoiceGender, VoiceLineRenderObj, VoiceLineType } from "../../../types/voiceLine";
import { recordVoiceLine } from "../../voice/recordVoiceLine";
import streamToMongo from "../../../database/streamToMongo";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import RadioServer from "../../server";

// This controller is only meant to be activated as part of the
// generateDefaultAudio dev script
export default (server: RadioServer) => (req: Request, res: Response): void => {
	const message = "Please authenticate with spotify to hear this song";
	const render = new VoiceLineRenderObj(Voice.DEFAULT, VoiceGender.DEFAULT, message, VoiceLineType.normal);
	recordVoiceLine(render).then(output => {
		return streamToMongo(message, output, "defaultAudio");
	}).then(audioId => {
		res.status(200).send(audioId);
		server.close();
	}).catch(internalErrorHandler(req, res));
};
