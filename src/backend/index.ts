// Brennan Wilkes

import RadioServer from "./server";
import downloadURLToStream from "./downloadURLToStream";
import streamVidToAudio from "./streamVidToAudio";
import streamToMongo from "./streamToMongo";
import streamFromMongo from "./streamFromMongo";
import dummyPipe from "./dummyPipe";

const server = new RadioServer();

server.app.get("/audio", (req, res) => {

	//https://www.youtube.com/watch?v=90AiXO1pAiA
	const dummy = dummyPipe();
	streamVidToAudio(downloadURLToStream("https://www.youtube.com/watch?v=90AiXO1pAiA"),dummy);
	streamToMongo("test", dummy).then(result => {
		console.log("Uploaded!");
		console.log(result);
		res.send(result);
		res.end();
	})
	.catch(err => {
		console.error(err);
		res.send(err);
		res.end();
	});
});

server.app.get("/get", (req, res) => {
	//6019a614b156e929be44dba6
	res.setHeader('content-type', 'audio/mpeg');
	streamFromMongo("6019a614b156e929be44dba6",res);

});


server.start();
