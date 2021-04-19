import { SongDoc } from "../database/models/song";
import { YoutubeResult } from "./youtubeResult";
import { SpotifyResult } from "./spotifyResult";
import { Link } from "./link";

export interface Song{
	title: string,
	artist: string,
	album: string,
	duration: number,
	explicit: boolean,
	spotifyId: string,
	artistSpotifyId: string,
	albumSpotifyId: string,
	youtubeId?: string,
	musicKitId?: string,
	audioId?: string,
	id?: string,
	tags: string[],
	thumbnailUrl: string,
	releaseDate: string
}

export interface SongApi extends Song{
	links: Link[]
}

export class SongObj implements Song {
	title: string;
	artist: string;
	album: string;
	duration: number;
	explicit: boolean;
	spotifyId: string;
	artistSpotifyId: string;
	albumSpotifyId: string;
	youtubeId?: string;
	musicKitId?: string;
	audioId?: string;
	id?:string;
	tags: string[];
	thumbnailUrl: string;
	releaseDate: string;
	constructor (
		title: string,
		artist: string,
		album: string,
		duration: number,
		explicit: boolean,
		spotifyId: string,
		artistSpotifyId: string,
		albumSpotifyId: string,
		ids: {
			youtubeId?: string,
			musicKitId?: string,
		},
		tags: string[],
		thumbnailUrl: string,
		releaseDate: string,
		audioId?: string,
		id?: string
	) {
		this.title = title;
		this.artist = artist;
		this.album = album;
		this.duration = duration;
		this.explicit = explicit;
		this.spotifyId = spotifyId;
		this.artistSpotifyId = artistSpotifyId;
		this.albumSpotifyId = albumSpotifyId;
		this.youtubeId = ids.youtubeId;
		this.musicKitId = ids.musicKitId;
		this.tags = tags;
		this.thumbnailUrl = thumbnailUrl;
		this.releaseDate = releaseDate;
		if (audioId) this.audioId = audioId;
		if (id) this.id = id;
	}
}

export class SongFromSpotify extends SongObj implements Song {
	constructor (spotifyResult: SpotifyResult, audioId?: string, id?: string) {
		super(
			spotifyResult.title,
			spotifyResult.artist,
			spotifyResult.album,
			spotifyResult.duration,
			spotifyResult.explicit,
			spotifyResult.spotifyId,
			spotifyResult.artistSpotifyId,
			spotifyResult.albumSpotifyId,
			{
			},
			[],
			spotifyResult.thumbnailUrl,
			spotifyResult.releaseDate,
			audioId,
			id
		);
	}
}

export class SongFromSearch extends SongObj implements Song {
	constructor (youtubeResult: YoutubeResult, spotifyResult: SpotifyResult, audioId?: string, id?: string) {
		super(
			spotifyResult.title,
			spotifyResult.artist,
			spotifyResult.album,
			spotifyResult.duration,
			spotifyResult.explicit,
			spotifyResult.spotifyId,
			spotifyResult.artistSpotifyId,
			spotifyResult.albumSpotifyId,
			{
				youtubeId: youtubeResult.youtubeId
			},
			youtubeResult.tags,
			spotifyResult.thumbnailUrl,
			spotifyResult.releaseDate,
			audioId,
			id
		);
	}
}

export class SongObjFromQuery extends SongObj implements Song {
	constructor (results: SongDoc) {
		super(
			results.title,
			results.artist,
			results.album,
			results.duration,
			results.explicit,
			results.spotifyId,
			results.artistSpotifyId,
			results.albumSpotifyId,
			{
				youtubeId: results.youtubeId,
				musicKitId: results.musicKitId
			},
			results.tags,
			results.thumbnailUrl,
			results.releaseDate,
			String(results.audioId),
			String(results._id)
		);
	}
}

export class SongApiObj extends SongObj implements SongApi {
	links: Link[]
	constructor (songBase: Song, links: Link[]) {
		super(
			songBase.title,
			songBase.artist,
			songBase.album,
			songBase.duration,
			songBase.explicit,
			songBase.spotifyId,
			songBase.artistSpotifyId,
			songBase.albumSpotifyId,
			{
				youtubeId: songBase.youtubeId,
				musicKitId: songBase.musicKitId
			},
			songBase.tags,
			songBase.thumbnailUrl,
			songBase.releaseDate,
			songBase.audioId,
			songBase.id
		);
		this.links = links;
	}
}
