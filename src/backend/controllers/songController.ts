import { Request, Response } from "express";
import Song, { SongModelFromSong } from "../../database/models/song";
import { SongApiObj, SongFromSearch, SongObjFromQuery } from "../../types/song";
import { CONFIG, print } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import notFoundErrorHandler from "../errorHandlers/notFoundErrorHandler";
import { mongoose } from "../../database/connection";
import { searchYoutubeDetailed } from "../youtube/searchYoutube";
import { getSpotifyTrack } from "../spotify/searchSpotify";
import { PlayAudioLink, SelfLink } from "../../types/link";
import { cacheSongFromResults, ensureSongValidity } from "../util/cacheSong";
import arrayshuffle from "array-shuffle";
import { findById as findPlaylistById, PlaylistDoc, PlaylistObjFromQuery } from "../../database/models/playlist";
import { getUserIdFromToken } from "../auth/getUser";
import accessDeniedErrorHandler from "../errorHandlers/accessDeniedErrorHandler";
import getRecommendations from "../spotify/getRecommendations";
import cacheSongsFromSpotify from "../spotify/cacheSongsFromSpotify";

const getSongs = (req: Request, res: Response): void => {
	const limit = (req.query.limit as number | undefined) ?? CONFIG.defaultApiLimit;

	print(`Handling request for song resources`);

	Song.find({}).limit(limit).then(result => {
		if (result) {
			const songProcessing = result.map(async result => {
				const validResult = await ensureSongValidity(result);
				const song = new SongObjFromQuery(validResult);
				return new SongApiObj(song, [
					new PlayAudioLink(req, song),
					new SelfLink(req, result._id, "songs")
				]);
			});
			Promise.all(songProcessing).then(songs => {
				res.send({
					songs: songs
				});
				res.end();
			}).catch(internalErrorHandler(req, res));
		} else {
			notFoundErrorHandler(req, res)("song", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};

const getSong = (req: Request, res: Response): void => {
	print(`Handling request for song resource ${req.params.id}`);

	Song.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) }).then(async result => {
		if (result) {
			const validResult = await ensureSongValidity(result);
			const song = new SongObjFromQuery(validResult);
			res.send({
				songs: [new SongApiObj(song, [
					new PlayAudioLink(req, song),
					new SelfLink(req, result._id, "songs")
				])]
			});
			res.end();
		} else {
			notFoundErrorHandler(req, res)("song", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};

const postSong = (req: Request, res: Response): void => {
	const errorHandler = internalErrorHandler(req, res);

	const youtubeId = String(req.query.youtubeId);
	const spotifyId = String(req.query.spotifyId);

	print(`Handling request for audio cache ${youtubeId} - ${spotifyId}`);

	searchYoutubeDetailed(youtubeId).then(youtubeInfo => {
		print(`Retrieved youtube information for "${youtubeInfo.title}"`);

		getSpotifyTrack(spotifyId).then(spotifyInfo => {
			print(`Retrieved spotify information for "${spotifyInfo.title}"`);

			cacheSongFromResults(youtubeInfo, spotifyInfo).then(audioId => {
				const newSong = new SongFromSearch(youtubeInfo, spotifyInfo, audioId);
				SongModelFromSong(newSong).save().then((resp) => {
					print(`Created song resource ${resp}`);
					res.send({
						songs: [
							new SongApiObj(new SongObjFromQuery(resp), [
								new PlayAudioLink(req, newSong),
								new SelfLink(req, resp._id, "songs")
							])
						]
					});
					res.end();
				}).catch(errorHandler);
			});
		}).catch(errorHandler);
	}).catch(errorHandler);
};

const sendNextSongResponse = (playlistResults: PlaylistDoc, req: Request, res:Response, limit: number) => {
	PlaylistObjFromQuery(playlistResults).then(playlist => {
		return getRecommendations({
			seed_tracks: arrayshuffle(playlist.songs).slice(0, 5).map(song => song.spotifyId),
			limit
		});
	}).then(recommendations => {
		return cacheSongsFromSpotify(recommendations);
	}).then(songs => {
		res.send({
			songs: songs.map(song => new SongApiObj(song, [
				new PlayAudioLink(req, song),
				new SelfLink(req, String(song.id), "songs")
			]))
		});
		res.end();
	}).catch(internalErrorHandler(req, res));
};

const getNextSong = (req: Request, res: Response): void => {
	const limit = (req.query.limit as number | undefined) ?? CONFIG.defaultApiLimit;
	findPlaylistById(String(req.query.playlist)).then(playlistResults => {
		if (playlistResults) {
			getUserIdFromToken(req.header("token") ?? "INVALID").then(user => {
				if (!playlistResults.private || user === String(playlistResults.user)) {
					sendNextSongResponse(playlistResults, req, res, limit);
				} else {
					accessDeniedErrorHandler(req, res)(playlistResults._id);
				}
			}).catch(() => {
				if (playlistResults.private) {
					accessDeniedErrorHandler(req, res)(playlistResults._id);
				} else {
					sendNextSongResponse(playlistResults, req, res, limit);
				}
			});
		} else {
			notFoundErrorHandler(req, res)("playlist", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};

export { getSongs, getSong, postSong, getNextSong };
