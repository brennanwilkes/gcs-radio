import { Request } from "express";
import { Song } from "./song";

export interface Link {
	rel: string;
	action: string;
	href: string;
	types: string[];
}

export class LinkObj implements Link {
	rel: string
	action: string
	href: string
	types: string[]

	constructor (rel: string, action: string, href: string, types: string[]) {
		this.rel = rel;
		this.action = action;
		this.href = href;
		this.types = types;
	}
}

export class DownloadLink extends LinkObj implements Link {
	constructor (req: Request, song: Song) {
		super(
			"Download",
			"POST",
			`${req.baseUrl}/songs?youtubeId=${song.youtubeId}&spotifyId=${song.spotifyId}`,
			["application/json"]
		);
	}
}

export class PlayAudioLink extends LinkObj implements Link {
	constructor (req: Request, song: Song) {
		super(
			"Play Audio",
			"GET",
			`${req.baseUrl}/audio/${song.audioId}`,
			["audio/mpeg"]
		);
	}
}

export class SelfSongLink extends LinkObj implements Link {
	constructor (req: Request, id: string) {
		super(
			"self",
			"GET",
			`${req.baseUrl}/songs/${id}`,
			["application/json"]
		);
	}
}
