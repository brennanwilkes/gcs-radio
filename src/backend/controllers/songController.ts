import { Request, Response } from "express";
import Song, { SongModelFromSong } from "../../database/models/song";
import streamToMongo from "../../database/streamToMongo";
import downloadURLToStream from "../youtube/downloadURLToStream";
import { SongApiObj, SongFromSearch, SongObjFromQuery } from "../../types/song";
import { print } from "../util/util";
import internalErrorHandler from "../errorHandlers/internalErrorHandler";
import notFoundErrorHandler from "../errorHandlers/notFoundErrorHandler";
import { mongoose } from "../../database/connection";
import { searchYoutubeDetailed } from "../youtube/searchYoutube";
import { getSpotifyTrack } from "../spotify/searchSpotify";
import { PlayAudioLink, SelfLink } from "../../types/link";

const getSongs = (req: Request, res: Response): void => {
	print(`Handling request for song resources`);

	Song.find({}).then(result => {
		if (result) {
			res.send({
				songs: result.map(result => {
					const song = new SongObjFromQuery(result);
					return new SongApiObj(song, [
						new PlayAudioLink(req, song),
						new SelfLink(req, result._id, "songs")
					]);
				})
			});
			res.end();
		} else {
			notFoundErrorHandler(req, res)("song", req.params.id);
		}
	}).catch(internalErrorHandler(req, res));
};

const getSong = (req: Request, res: Response): void => {
	print(`Handling request for song resource ${req.params.id}`);

	Song.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) }).then(result => {
		if (result) {
			const song = new SongObjFromQuery(result);
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
	const url = `https://www.youtube.com/watch?v=${youtubeId}`;

	print(`Handling request for audio cache ${youtubeId} - ${spotifyId}`);

	searchYoutubeDetailed(youtubeId).then(youtubeInfo => {
		print(`Retrieved youtube information for "${youtubeInfo.title}"`);

		getSpotifyTrack(spotifyId).then(spotifyInfo => {
			print(`Retrieved spotify information for "${spotifyInfo.title}"`);

			downloadURLToStream(url, youtubeInfo.formats).then(dummy => {
				print("Created audio conversion stream");

				streamToMongo(`${spotifyInfo.title} - ${spotifyInfo.artist} - ${spotifyInfo.album}`, dummy).then(audioId => {
					print(`Created audio resource ${audioId}`);

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
				}).catch(errorHandler);
			}).catch(errorHandler);
		}).catch(errorHandler);
	}).catch(errorHandler);
};

export { getSongs, getSong, postSong };
