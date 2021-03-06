// Imports the Google Cloud client library
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";

// Import other required libraries
import "dotenv/config";
import { VoiceLineRender } from "../../types/voiceLine";
import DummyPipe from "../util/dummyPipe";
import { Readable, Transform } from "stream";
import { CONFIG } from "../util/util";

// Creates a client
const client = new TextToSpeechClient({
	projectId: CONFIG.googleProjectId,
	keyFilename: CONFIG.googleCredentialsFile
});

export async function recordVoiceLine (voiceLine: VoiceLineRender): Promise<Transform> {
	return new Promise<Transform>((resolve, reject) => {
		const dummy = DummyPipe();
		const voiceSplit = voiceLine.voice.split("-");

		const request = {
			input: {
				text: voiceLine.text
			},

			// Select the language and SSML Voice Gender (optional)
			voice: {
				languageCode: `${voiceSplit[0]}-${voiceSplit[1]}`,
				name: voiceLine.voice as string,
				ssmlGender: voiceLine.gender as number
			},

			// Select the type of audio encoding
			audioConfig: {
				audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.LINEAR16,
				sampleRateHertz: 8000
			}
		};

		client.synthesizeSpeech(request).then(response => {
			if (response[0]?.audioContent) {
				Readable.from(response[0].audioContent).pipe(dummy);
				resolve(dummy);
			} else {
				reject(new Error("Invalid audio content"));
			}
		}).catch(err => reject(err));
	});
}
