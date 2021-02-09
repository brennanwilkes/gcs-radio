// Imports the Google Cloud client library
import { TextToSpeechClient, protos } from "@google-cloud/text-to-speech";

// Import other required libraries
import "dotenv/config";
import { VoiceLineRender } from "../types/voiceLine";
import DummyPipe from "../util/dummyPipe";
import { Readable, Transform } from "stream";

// Creates a client
const client = new TextToSpeechClient({
	projectId: process.env.GOOGLE_PROJECT,
	keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

export async function recordVoiceLine (voiceLine: VoiceLineRender) {
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
			if (response[0].audioContent) {
				// fs.writeFileSync(`output.mp3`, response[0].audioContent, `binary`);
				Readable.from(response[0].audioContent).pipe(dummy);
				resolve(dummy);
			} else {
				reject(new Error("Invalid audio content"));
			}
		}).catch(err => reject(err));
	});
}
