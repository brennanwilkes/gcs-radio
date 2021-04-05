// Brennan Wilkes

// Imports
import { Router } from "express";

import { limitValidator } from "../validators/validatorUtil";
import validationErrorHandler from "../errorHandlers/validationErrorHandler";
import getSongs from "../controllers/song/getSongs";
import getNextSongValidator from "../validators/song/getNextSongValidator";
import getSongValidator from "../validators/song/getSongValidator";
import getNextSongs from "../controllers/song/getNextSongs";
import getSong from "../controllers/song/getSong";
import postSongValidator from "../validators/song/postSongValidator";
import postSong from "../controllers/song/postSong";
import getPlaylists from "../controllers/playlist/getPlaylists";
import { tokenValidator } from "../validators/auth/userValidator";
import getSpotifyPlaylistValidator from "../validators/playlist/getSpotifyPlaylistValidator";
import getForMePlaylists from "../controllers/playlist/getForMePlaylists";
import getPlaylist from "../controllers/playlist/getPlaylist";
import getPlaylistValidator from "../validators/playlist/getPlaylistValidator";
import patchPlaylistValidator from "../validators/playlist/patchPlaylistValidator";
import patchPlaylist from "../controllers/playlist/patchPlaylist";
import deletePlaylist from "../controllers/playlist/deletePlaylist";
import postPlaylist from "../controllers/playlist/postPlaylist";
import postPlaylistValidator from "../validators/playlist/postPlaylistValidator";
import getGeneratedPlaylistValidator from "../validators/playlist/getGeneratedPlaylistValidator";
import getGeneratedPlaylist from "../controllers/playlist/getGeneratedPlaylist";
import postVoiceLineValidator from "../validators/voiceLine/postVoiceLineValidator";
import getVoiceLine from "../controllers/voiceLine/getVoiceLine";
import { getAudio } from "../controllers/audio/audioController";
import audioValidator from "../validators/audio/audioValidator";
import postVoiceLine from "../controllers/voiceLine/postVoiceLine";
import { search } from "../controllers/song/queryController";
import searchValidator from "../validators/song/searchValidator";

const apiV1Router = Router();

apiV1Router.get("/", (_req, res) => res.send({
	healthy: true
}));

apiV1Router.get("/songs", [limitValidator(30), validationErrorHandler], getSongs);
apiV1Router.post("/songs/next", getNextSongValidator, getNextSongs);
apiV1Router.get("/songs/:id", getSongValidator, getSong);
apiV1Router.post("/songs", postSongValidator, postSong);

apiV1Router.get("/playlists", [limitValidator(30), validationErrorHandler], getPlaylists);
apiV1Router.post("/playlists/made-for-me", [...tokenValidator, ...getSpotifyPlaylistValidator], getForMePlaylists);
apiV1Router.post("/playlists/generate", getGeneratedPlaylistValidator, getGeneratedPlaylist);

apiV1Router.get("/playlists/:id", getPlaylistValidator, getPlaylist);
apiV1Router.patch("/playlists/:id", [...tokenValidator, ...patchPlaylistValidator], patchPlaylist);
apiV1Router.delete("/playlists/:id", [...tokenValidator, ...getPlaylistValidator], deletePlaylist);
apiV1Router.post("/playlists", postPlaylistValidator, postPlaylist);

apiV1Router.post("/voiceLines", postVoiceLineValidator, postVoiceLine);
apiV1Router.get("/voiceLines/:id", getVoiceLine);

apiV1Router.get("/audio/:id", audioValidator, getAudio);
apiV1Router.get("/search", searchValidator, search);

export default apiV1Router;
