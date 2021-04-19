import ytdl from "ytdl-core";
// import streamToMongo from "../../database/streamToMongo";
import { Song, SongObjFromQuery } from "../../types/song";
import { SongDoc } from "../../database/models/song";
import { CONFIG, print } from "../util/util";
import { mongoVerifyBucketExistance } from "../validators/validatorUtil";
import { searchYoutubeDetailed } from "../youtube/searchYoutube";
import { mongoose } from "../../database/connection";
import youtubePlayableConverter from "../youtube/youtubePlayableConverter";
import { DummyYoutubeResult } from "../../types/youtubeResult";

// Ensures a song has a valid audio ID
export const ensureSongValidity = (song: SongDoc, formats?: ytdl.videoFormat[]): Promise<SongDoc> => {
	return new Promise<SongDoc>((resolve, reject) => {
		mongoVerifyBucketExistance(
			String(song.audioId),
			(CONFIG.defaultAudioId && String(song.audioId) === CONFIG.defaultAudioId)
				? "defaultAudio"
				: "audio"
		)
			.then(exists => {
				if (exists) {
					print(`${song.title} already cached`);
					return Promise.resolve(song);
				} else {
					return Promise.reject(new Error("Bucket does not exist"));
				}
			}).then(resolve).catch(() => {
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
	let upgradedSongCache: Song | undefined;
	if (formats) {
		return cacheSong(song.youtubeId, formats, song.title, song.artist, song.album);
	} else {
		return new Promise<string>((resolve, reject) => {
			(youtubePlayableConverter.isPlayable(song)
				? Promise.resolve(song)
				: youtubePlayableConverter.upgradeToPlayable(song)
			).then(upgradedSong => {
				upgradedSongCache = upgradedSong;
				if (!CONFIG.matchWithYoutube) {
					return Promise.resolve(new DummyYoutubeResult(upgradedSong.youtubeId));
				} else {
					return searchYoutubeDetailed(upgradedSong.youtubeId);
				}
			}).then(info => {
				if (!upgradedSongCache) {
					return Promise.reject(new Error("Something went wrong upgrading song"));
				}
				return cacheSong(
					upgradedSongCache.youtubeId,
					info.formats,
					song.title,
					song.artist,
					upgradedSongCache.album
				);
			}).then(resolve).catch(reject);
		});
	}
};

const cacheSong = (_youtubeId: string | undefined, _formats: ytdl.videoFormat[], _title: string, _artist: string, _album: string): Promise<string> => {
	if (!CONFIG.matchWithYoutube) {
		if (CONFIG.defaultAudioId) {
			return Promise.resolve(CONFIG.defaultAudioId);
		}
		return Promise.reject(new Error("Default audio ID is not set"));
	}

	/*
		Here is where further modules can be added for different players
		If you want to directly cache the audio to the audio endpoint of the server,
		do it here, and resolve the promise to the audioID
	*/
	return Promise.reject(new Error("Match with youtube must be set to false in current repo state"));
};

export default cacheSong;
