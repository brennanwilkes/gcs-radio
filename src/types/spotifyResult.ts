import SpotifyApi from "spotify-web-api-node";

export interface SpotifyResult{
	title: string,
	artist: string,
	album: string,
	duration: number,
	explicit: boolean,
	spotifyId: string,
	artistSpotifyId: string,
	albumSpotifyId: string,
	thumbnailUrl: string,
	releaseDate: string
}

export class SpotifyResultFromApi implements SpotifyResult {
	title: string;
	artist: string;
	album: string;
	duration: number;
	explicit: boolean;
	spotifyId: string;
	artistSpotifyId: string;
	albumSpotifyId: string;
	thumbnailUrl: string;
	releaseDate: string;
	constructor (results: SpotifyApi.TrackObjectFull) {
		this.title = results.name;
		this.artist = results.artists[0].name;
		this.album = results.album.name;
		this.duration = results.duration_ms;
		this.explicit = results.explicit;
		this.spotifyId = results.id;
		this.artistSpotifyId = results.artists[0].id;
		this.albumSpotifyId = results.album.id;
		this.thumbnailUrl = results.album.images[0].url;
		this.releaseDate = results.album.release_date;
	}
}
