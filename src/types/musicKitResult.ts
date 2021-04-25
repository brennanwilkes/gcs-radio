export interface MusicKitResult{
	title: string,
	artist: string,
	album: string,
	musicKitId: string,
	duration: number,
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export class MusicKitResultFromApi implements MusicKitResult {
	title: string;
	artist: string;
	album: string;
	musicKitId: string;
	duration: number;
	constructor (results: any) {
		this.title = results?.attributes?.name ?? "UNKOWN";
		this.artist = results?.attributes?.artistName ?? "UNKNOWN";
		this.album = results?.attributes?.albumName ?? "UNKNOWN";
		this.musicKitId = results?.id ?? "UNKNOWN";
		this.duration = results?.attributes?.durationInMillis ?? 0;
	}
}
/* eslint-enable @typescript-eslint/no-explicit-any */
