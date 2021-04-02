// Brennan Wilkes

// Imports
import { Router } from "express";
import { getSong, getSongs, postSong, getNextSong } from "../controllers/songController";
import { getAudio } from "../controllers/audioController";
import { search } from "../controllers/queryController";
import audioValidator from "../validators/audioValidator";
import postSongValidator from "../validators/postSongValidator";
import postVoiceLineValidator from "../validators/postVoiceLineValidator";
import getSongValidator from "../validators/getSongValidator";
import searchValidator from "../validators/searchValidator";
import getSpotifyPlaylistValidator from "../validators/getSpotifyPlaylistValidator";

import { postVoiceLine, getVoiceLine } from "../controllers/voiceLineController";
import { getPlaylist, getPlaylists, postPlaylist, patchPlaylist, deletePlaylist, getForMePlaylists } from "../controllers/playlistController";
import getPlaylistValidator from "../validators/getPlaylistValidator";
import patchPlaylistValidator from "../validators/patchPlaylistValidator";
import postPlaylistValidator from "../validators/postPlaylistValidator";
import { tokenValidator } from "../validators/userValidator";
import { limitValidator } from "../validators/validatorUtil";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import getNextSongValidator from "../validators/getNextSongValidator";

const apiV1Router = Router();

apiV1Router.get("/", (_req, res) => res.send({
	healthy: true
}));

apiV1Router.get("/songs", [limitValidator(30), validationErrorHandler], getSongs);
apiV1Router.post("/songs/next", getNextSongValidator, getNextSong);
apiV1Router.get("/songs/:id", getSongValidator, getSong);
apiV1Router.post("/songs", postSongValidator, postSong);

apiV1Router.get("/playlists", [limitValidator(30), validationErrorHandler], getPlaylists);
apiV1Router.post("/playlists/made-for-me", [...tokenValidator, ...getSpotifyPlaylistValidator], getForMePlaylists);
apiV1Router.get("/playlists/:id", getPlaylistValidator, getPlaylist);
apiV1Router.patch("/playlists/:id", [...tokenValidator, ...patchPlaylistValidator], patchPlaylist);
apiV1Router.delete("/playlists/:id", [...tokenValidator, ...getPlaylistValidator], deletePlaylist);
apiV1Router.post("/playlists", postPlaylistValidator, postPlaylist);

apiV1Router.post("/voiceLines", postVoiceLineValidator, postVoiceLine);
apiV1Router.get("/voiceLines/:id", getVoiceLine);

apiV1Router.get("/audio/:id", audioValidator, getAudio);
apiV1Router.get("/search", searchValidator, search);

export default apiV1Router;
