import { Request } from "express";
import { Song } from "./song";
import { VoiceLineRender } from "./voiceLine";

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
			`${req.baseUrl}/songs?spotifyId=${song.spotifyId}`,
			["application/json"]
		);
	}
}

export class PlayAudioLink extends LinkObj implements Link {
	constructor (req: Request, audio: Song | VoiceLineRender) {
		super(
			"Play Audio",
			"GET",
			`${req.baseUrl}/audio/${audio.audioId}`,
			["audio/mpeg"]
		);
	}
}

export class SelfLink extends LinkObj implements Link {
	constructor (req: Request, id: string, resourcePath: string) {
		super(
			"self",
			"GET",
			`${req.baseUrl}/${resourcePath}/${id}`,
			["application/json"]
		);
	}
}

export class PatchLink extends LinkObj implements Link {
	constructor (req: Request, id: string, resourcePath: string) {
		super(
			"edit",
			"PATCH",
			`${req.baseUrl}/${resourcePath}/${id}`,
			["application/json"]
		);
	}
}
