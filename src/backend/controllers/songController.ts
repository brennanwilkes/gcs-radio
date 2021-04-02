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

export { getSongs, getSong, postSong };
