// Brennan Wilkes

import RadioServer from "./server";
import downloadURLToStream from "./youtube/downloadURLToStream";
import downloadURLinfo from "./youtube/downloadURLinfo";
import streamVidToAudio from "./util/streamVidToAudio";
import streamToMongo from "../database/streamToMongo";
import streamFromMongo from "../database/streamFromMongo";
import dummyPipe from "./util/dummyPipe";
import { mongoose } from "../database/connection";
import { SongFromInfo } from "../database/models/song";
import searchYoutube from "./youtube/searchYoutube";

const server = new RadioServer();

server.app.get("/audio/:v", async (req, res) => {
	// https://www.youtube.com/watch?v=90AiXO1pAiA - short
	// https://www.youtube.com/watch?v=y0nSDOiAHo0 - long
	const dummy = dummyPipe();

	// const url = "https://www.youtube.com/watch?v=y0nSDOiAHo0";
	const url = `https://www.youtube.com/watch?v=${req.params.v}`;

	const info = await downloadURLinfo(url);

	streamVidToAudio(downloadURLToStream(url), dummy);
	streamToMongo(`${info.track} - ${info.artist} - ${info.album}`, dummy).then(audioId => {
		const resp = {
			title: info.track,
			artist: info.artist,
			albumn: info.album,
			audioId: audioId
		};
		SongFromInfo(info, audioId).save().then(response => {
			res.send(resp);
			res.end();
		}).catch(error => {
			res.status(500).send(error);
			res.end();
		});
	})
		.catch(err => {
			console.error(err);
			res.send(err);
			res.end();
		});
});

server.app.get("/song/:id", (req, res) => {
	// 6019b506081dc540b0631483 - short
	// 6019a614b156e929be44dba6 - long
	res.setHeader("content-type", "audio/mpeg");
	streamFromMongo(req.params.id, res);
});

server.app.get("/search/:query", (req, res) => {
	searchYoutube(req.params.query).then(results => {
		res.send({ results: results });
	}).catch(err => {
		res.send(err);
	});
});

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", function callback () {
	server.start();
});
