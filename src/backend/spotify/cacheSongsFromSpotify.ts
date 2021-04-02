import { SongModelFromSong } from "../../database/models/song";
import { Song, SongObj, SongObjFromQuery } from "../../types/song";
import { SpotifyResult } from "../../types/spotifyResult";
import { cacheSongFromSong } from "../util/cacheSong";
import resolveSpotifySongs from "../util/resolveSongs";

export default (spotifyResults: SpotifyResult[]):Promise<Song[]> => {
	let savedSetlist: Song[] = [];

	return new Promise<Song[]>((resolve, reject) => {
		resolveSpotifySongs(spotifyResults).then(setlist => {
			savedSetlist = setlist;
			return Promise.all(setlist.map(song => cacheSongFromSong(song)));
		}).then(cached => {
			const withAudioId = savedSetlist.map((song, j) => new SongObj(
				song.title,
				song.artist,
				song.album,
				song.duration,
				song.explicit,
				song.spotifyId,
				song.artistSpotifyId,
				song.albumSpotifyId,
				song.youtubeId,
				song.tags,
				song.thumbnailUrl,
				song.releaseDate,
				cached[j]
			));
			return Promise.all(withAudioId.map(song => SongModelFromSong(song).save()));
		}).then(docs => {
			resolve(docs.map(doc => new SongObjFromQuery(doc)));
		}).catch(reject);
	});
};
