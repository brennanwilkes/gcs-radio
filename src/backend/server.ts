import express, { Express, Router } from "express";
import bodyParser from "body-parser";
import path from "path";
import { Server } from "http";

import { CONFIG, print } from "./util/util";

/**
	Server abstration object
	@class
*/
export default class RadioServer {
	/**
		Port to use. Defaults to a "PORT" env variable if set (For GCP Run and other deployment methods),
		otherwise uses the port set in the config file. Defaults to 8080.
		@type {number|string}
	*/
	port: string | number

	/**
		Express init object
		@type {object}
	*/
	app: Express

	server: Server | undefined

	/**
		Basic express setup.
		Sets JSON encoding, url encoded bodies and static routing.
		Sets up routes from API config
	*/
	constructor () {
		// Initialize port
		this.port = process.env.PORT ?? CONFIG.port ?? 8080;

		// Initialize express
		this.app = express();

		// support json encoded bodies
		this.app.use(express.json());

		// support encoded bodies
		this.app.use(bodyParser.urlencoded({ extended: true }));

		// Static routing for public files
		this.app.use("/", express.static(path.join(__dirname, "..", "..", "public-frontend")));
	}

	route (path: string, router: Router): void {
		this.app.use(path, router);
		print(`Created route ${path}`);
	}

	/**
		Starts the webserver.
		This method should be run last, after init and routing.
	*/
	start (): void {
		// 404 messages
		this.app.get("*", (req, res) => {
			print("Received invalid GET request for", req.url);

			res.writeHead(404, { "Content-Type": "text/html" });
			res.write("<h1>404: If you see this, it's already too late!</h1>");
			res.end();
		});

		// Socket init
		this.server = this.app.listen(this.port, () => {
			if (this.server) {
				const address = this.server?.address();
				print("server is listening", (address && !(typeof address === "string")) ? ` on port ${address.port}` : "");
			}
		});
	}

	/**
	 * Closes socket connection
	 */
	close (): void {
		if (this.server) {
			this.server.close();
		}
	}
}
