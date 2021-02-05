export interface Thumbnail {
	url: string;
	width: number;
	resolution: string;
	id: string;
	height: number;
}

export interface VideoData {
	uploadDate: string;
	duration: string;
	fulltitle: string;
	album: string;
	title: string;
	id: string;
	tags: string[];
	track: string;
	thumbnails: Thumbnail[];
	artist: string;
}

export class ThumbnailObj implements Thumbnail {
	url: string;
	width: number;
	resolution: string;
	id: string;
	height: number;
	constructor (url: string, width: number, resolution: string, id: string, height: number) {
		this.url = url;
		this.width = width;
		this.resolution = resolution;
		this.id = id;
		this.height = height;
	}
}

export default class VideoDataObj implements VideoData {
	uploadDate: string;
	duration: string;
	fulltitle: string;
	album: string;
	title: string;
	id: string;
	tags: string[];
	track: string;
	thumbnails: Thumbnail[];
	artist: string;
	constructor (
		uploadDate: string,
		duration: string,
		fulltitle: string,
		album: string,
		title: string,
		id: string,
		tags: string[],
		track: string,
		thumbnails: Thumbnail[],
		artist: string) {
		this.uploadDate = uploadDate;
		this.duration = duration;
		this.fulltitle = fulltitle;
		this.album = album;
		this.title = title;
		this.id = id;
		this.tags = tags;
		this.track = track;
		this.thumbnails = [];
		thumbnails.forEach(thumb => {
			this.thumbnails = [...this.thumbnails, new ThumbnailObj(thumb.url, thumb.width, thumb.resolution, thumb.id, thumb.height)];
		});
		this.artist = artist;
	}
}
