export interface YoutubeResult{
	title: string,
	artist: string,
	youtubeArtist: string,
	youtubeTitle: string,
	album: string,
	youtubeId: string,
	tags: string[],
	duration: number
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
	constructor (results: any) {
		this.title = results.media.song ?? "Unknown";
		this.artist = results.media.artist ?? "Unknown";
		this.youtubeArtist = results.author.name ?? "Unknown";
		this.youtubeTitle = results.title ?? "Unknown";
		this.album = results.media.album ?? "Unknown";
		this.youtubeId = results.videoId ?? "Unknown";
		this.tags = results.keywords ?? [];
		this.duration = parseInt(results.lengthSeconds ?? "0") * 1000;
	}
}
