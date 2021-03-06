import express, { Express, Router } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { Server } from "http";

import { CONFIG, print } from "./util/util";
import logger from "./logging/logger";

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
		this.port = CONFIG.port ?? 8080;

		// Initialize express
		this.app = express();

		// support json encoded bodies
		this.app.use(express.json());

		// Parse cookies
		this.app.use(cookieParser());

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
			res.write(`
			<html>
				<head>
					<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
					<style>
						body{
							display: flex;
							justify-content: center;
							align-items: center;
							background-color: #1c2630;
						}
						h1:first-of-type{
							color: #f2542d;
						}
						h1:last-of-type{
							color: #c8c1f5ff;
						}
					</style>
				</head>
				<body>
					<h1>404</h1><h1>: If you see this, it's already too late!</h1>
				</body>
			</html>
			`);
			logger.logApiCall("404");
			res.end();
		});

		// Socket init
		this.server = this.app.listen(this.port, () => {
			if (this.server) {
				const address = this.server?.address();
				print("server is listening", (address && !(typeof address === "string")) ? `on port ${address.port}` : "");
				logger.logServerUp();
			}
		});

		// Up server timeout
		this.server.setTimeout(0);
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
