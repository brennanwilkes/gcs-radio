// Brennan Wilkes

import RadioServer from "./server";
import downloadURLToStream from "./downloadURLToStream";
import downloadURLinfo from "./downloadURLinfo";
//import {VideoData} from "./videoData";
import streamVidToAudio from "./streamVidToAudio";
import streamToMongo from "./streamToMongo";
import streamFromMongo from "./streamFromMongo";
import dummyPipe from "./dummyPipe";
import {mongoose} from "../database/connection";


const server = new RadioServer();

server.app.get("/audio", async (req, res) => {

	//https://www.youtube.com/watch?v=90AiXO1pAiA - short
	//https://www.youtube.com/watch?v=y0nSDOiAHo0 - long
	const dummy = dummyPipe();

	const url = "https://www.youtube.com/watch?v=y0nSDOiAHo0";

	const info = await downloadURLinfo(url);

	streamVidToAudio(downloadURLToStream(url),dummy);
	streamToMongo(`${info.track} - ${info.creator} - ${info.album}`, dummy).then(result => {
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

server.app.get("/song/:id", (req, res) => {
	//6019b506081dc540b0631483 - short
	//6019a614b156e929be44dba6 - long
	res.setHeader('content-type', 'audio/mpeg');
	streamFromMongo(req.params.id,res);

});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function callback () {
	server.start();
});
