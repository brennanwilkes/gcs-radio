import { VideoData } from "./videoData";

export interface Song{
	audioId: string,
	uploadDate: string,
	duration: string,
	fullTitle: string,
	album: string,
	youtubeTitle: string,
	youtubeID: string,
	tags: string[],
	songTitle: string,
	thumbnailUrl: string,
	artist: string,
}

export class SongObj implements Song {
	audioId: string
	uploadDate: string
	duration: string
	fullTitle: string
	album: string
	youtubeTitle: string
	youtubeID: string
	tags: string[]
	songTitle: string
	thumbnailUrl: string
	artist: string
	constructor (
		audioId: string,
		uploadDate: string,
		duration: string,
		fullTitle: string,
		album: string,
		youtubeTitle: string,
		youtubeID: string,
		tags: string[],
		songTitle: string,
		thumbnailUrl: string,
		artist: string) {
		this.audioId = audioId;
		this.uploadDate = uploadDate;
		this.duration = duration;
		this.fullTitle = fullTitle;
		this.album = album;
		this.youtubeTitle = youtubeTitle;
		this.youtubeID = youtubeID;
		this.tags = tags;
		this.songTitle = songTitle;
		this.thumbnailUrl = thumbnailUrl;
		this.artist = artist;
	}
}

export class SongInfo extends SongObj {
	constructor (video: VideoData, id: string) {
		super(
			id,
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
