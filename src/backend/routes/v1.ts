// Brennan Wilkes

// Imports
import { Router } from "express";
import { getSong, getSongs, postSong } from "../controllers/songController";
import { getAudio } from "../controllers/audioController";
import { query } from "../controllers/queryController";
import audioValidator from "../validators/audioValidator";

const apiV1Router = Router();

apiV1Router.get("/", (_req, res) => res.send({
	healthy: true
}));
apiV1Router.get("/songs", getSongs);
apiV1Router.get("/songs/:id", getSong);
apiV1Router.post("/songs", postSong);

apiV1Router.get("/audio/:id", audioValidator, getAudio);
apiV1Router.get("/search", query);

export default apiV1Router;
