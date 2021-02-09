// Brennan Wilkes

import RadioServer from "./server";
import { mongoose } from "../database/connection";
import mainRouter from "./routes/index";

const server = new RadioServer();

server.route("/", mainRouter);

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", function callback () {
	server.start();
});
