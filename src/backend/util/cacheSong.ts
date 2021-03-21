import ytdl from "ytdl-core";
import streamToMongo from "../../database/streamToMongo";
import { Song, SongObjFromQuery } from "../../types/song";
import { SongDoc } from "../../database/models/song";
import { SpotifyResult } from "../../types/spotifyResult";
import { YoutubeResult } from "../../types/youtubeResult";
import { CONFIG, print } from "../util/util";
import { mongoVerifyBucketExistance } from "../validators/validatorUtil";
import downloadURLToStream from "../youtube/downloadURLToStream";
import { searchYoutubeDetailed } from "../youtube/searchYoutube";
import { mongoose } from "../../database/connection";

export const ensureSongValidity = (song: SongDoc, formats?: ytdl.videoFormat[]): Promise<SongDoc> => {
	return new Promise<SongDoc>((resolve, reject) => {
		mongoVerifyBucketExistance(String(song.audioId), (CONFIG.defaultAudioId && String(song.audioId) === CONFIG.defaultAudioId) ? "defaultAudio" : "audio").then(exists => {
			if (exists) {
				print(`${song.title} already cached`);
				resolve(song);
			} else {
				cacheSongFromSong(new SongObjFromQuery(song), formats).then(audioId => {
					song.audioId = new mongoose.Schema.Types.ObjectId(audioId);
					return song.save();
				}).then(newDoc => {
					resolve(newDoc);
				}).catch(reject);
			}
		}).catch(() => {
			cacheSongFromSong(new SongObjFromQuery(song), formats).then(audioId => {
				song.audioId = new mongoose.Schema.Types.ObjectId(audioId);
				return song.save();
			}).then(newDoc => {
				resolve(newDoc);
			}).catch(reject);
		});
	});
};

export const cacheSongFromSong = (song: Song, formats?: ytdl.videoFormat[]): Promise<string> => {
	if (formats) {
		return cacheSong(song.youtubeId, formats, song.title, song.artist, song.album);
	} else {
		return new Promise<string>((resolve, reject) => {
			searchYoutubeDetailed(song.youtubeId).then(info => {
				cacheSong(song.youtubeId, info.formats, song.title, song.artist, song.album).then(resolve).catch(reject);
			}).catch(reject);
		});
	}
};

export const cacheSongFromResults = (youtubeResults: YoutubeResult, spotifyResults: SpotifyResult): Promise<string> => {
	return cacheSong(youtubeResults.youtubeId, youtubeResults.formats, spotifyResults.title, spotifyResults.artist, spotifyResults.album);
};

const cacheSong = (youtubeId: string, formats: ytdl.videoFormat[], title: string, artist: string, album: string): Promise<string> => {
	if (!CONFIG.matchWithYoutube) {
		if (CONFIG.defaultAudioId) {
			return Promise.resolve(CONFIG.defaultAudioId);
		}
		return Promise.reject(new Error("Default audio ID is not set"));
	}

	const url = `https://www.youtube.com/watch?v=${youtubeId}`;
	return new Promise<string>((resolve, reject) => {
		downloadURLToStream(url, formats).then(dummy => {
			print("Created audio conversion stream");
			streamToMongo(`${title} - ${artist} - ${album}`, dummy).then(audioId => {
				print(`Created audio resource ${audioId}`);
				resolve(audioId);
			}).catch(reject);
		}).catch(reject);
	});
};

export default cacheSong;
