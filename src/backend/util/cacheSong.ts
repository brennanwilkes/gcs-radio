import ytdl from "ytdl-core";
import streamToMongo from "../../database/streamToMongo";
import { Song } from "../../types/song";
import { SpotifyResult } from "../../types/spotifyResult";
import { YoutubeResult } from "../../types/youtubeResult";
import { print } from "../util/util";
import downloadURLToStream from "../youtube/downloadURLToStream";
import { searchYoutubeDetailed } from "../youtube/searchYoutube";

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
