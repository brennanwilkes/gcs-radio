// Brennan Wilkes

import RadioServer from "./server";
import download from "./download";
import convert from "./convert";
import upload from "./upload";
import dummyPipe from "./dummyPipe";

const server = new RadioServer();

server.app.get("/audio", (req, res) => {


	//https://www.youtube.com/watch?v=90AiXO1pAiA
	const dummy = dummyPipe();
	convert(download("https://www.youtube.com/watch?v=90AiXO1pAiA"),dummy);
	upload("test", dummy).then(result => {
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

server.start();
