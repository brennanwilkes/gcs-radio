import ytdl from "ytdl-core";

export interface YoutubeResult{
	title: string,
	artist: string,
	youtubeArtist: string,
	youtubeTitle: string,
	album: string,
	youtubeId: string,
	tags: string[],
	duration: number,
	formats: ytdl.videoFormat[]
}

export class YoutubeResultFromApi implements YoutubeResult {
	title: string;
	artist: string;
	youtubeArtist: string;
	youtubeTitle: string;
	album: string;
	youtubeId: string;
	tags: string[];
	duration: number;
	formats: ytdl.videoFormat[];
	constructor (results: ytdl.videoInfo) {
		this.title = results.videoDetails.media?.song ?? "Unknown";
		this.artist = results.videoDetails.media?.artist ?? "Unknown";
		this.youtubeArtist = results.videoDetails.author?.name ?? "Unknown";
		this.youtubeTitle = results.videoDetails.title ?? "Unknown";
		this.album = (results.videoDetails.media as any)?.album ?? "Unknown";
		this.youtubeId = results.videoDetails.videoId ?? "Unknown";
		this.tags = results.videoDetails.keywords ?? [];
		this.duration = parseInt(results.videoDetails.lengthSeconds ?? "0") * 1000;
		this.formats = results.formats ?? [];
	}
}

export class DummyYoutubeResult implements YoutubeResult {
	title: string;
	artist: string;
	youtubeArtist: string;
	youtubeTitle: string;
	album: string;
	youtubeId: string;
	tags: string[];
	duration: number;
	formats: ytdl.videoFormat[];
	constructor (id = "Unknown") {
		this.title = "Unknown";
		this.artist = "Unknown";
		this.youtubeArtist = "Unknown";
		this.youtubeTitle = "Unknown";
		this.album = "Unknown";
		this.youtubeId = id;
		this.tags = [];
		this.duration = 0;
		this.formats = [];
	}
}
