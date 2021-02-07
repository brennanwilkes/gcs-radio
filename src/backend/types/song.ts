import { VideoData } from "./videoData";
import { SongDoc } from "../../database/models/song";

export interface Song{
	songId: string,
	audioId: string,
	uploadDate: string,
	duration: string,
	fullTitle: string,
	album: string,
	youtubeTitle: string,
	youtubeId: string,
	tags: string[],
	songTitle: string,
	thumbnailUrl: string,
	artist: string,
}

export class SongObj implements Song {
	songId: string
	audioId: string
	uploadDate: string
	duration: string
	fullTitle: string
	album: string
	youtubeTitle: string
	youtubeId: string
	tags: string[]
	songTitle: string
	thumbnailUrl: string
	artist: string
	constructor (
		songId: string,
		audioId: string,
		uploadDate: string,
		duration: string,
		fullTitle: string,
		album: string,
		youtubeTitle: string,
		youtubeId: string,
		tags: string[],
		songTitle: string,
		thumbnailUrl: string,
		artist: string) {
		this.songId = songId;
		this.audioId = audioId;
		this.uploadDate = uploadDate;
		this.duration = duration;
		this.fullTitle = fullTitle;
		this.album = album;
		this.youtubeTitle = youtubeTitle;
		this.youtubeId = youtubeId;
		this.tags = tags;
		this.songTitle = songTitle;
		this.thumbnailUrl = thumbnailUrl;
		this.artist = artist;
	}
}

export class SongObjFromInfo extends SongObj {
	constructor (video: VideoData, songId: string, audioId: string) {
		super(
			songId,
			audioId,
			video.uploadDate,
			video.duration,
			video.fulltitle,
			video.album,
			video.title,
			video.id,
			video.tags,
			video.track,
			video.thumbnails[0]?.url ?? "none",
			video.artist
		);
	}
}

export class SongObjFromQuery extends SongObj {
	constructor (results: SongDoc) {
		super(
			results._id,
			results.audioId.toString(),
			results.uploadDate,
			results.duration,
			results.fullTitle,
			results.album,
			results.youtubeTitle,
			results.id,
			results.tags,
			results.songTitle,
			results.thumbnailUrl,
			results.artist
		);
	}
}
