import { Song } from "../song";

export interface upgradeToPlayable<T extends Song> {
	(base: Song): Promise<T>;
}
export interface directUpgradeToPlayable<T>{
	(song: Song, ...args : any[]): T
}

export interface isPlayable<T extends Song> {
	(song: Song): song is T
}

export interface isEquivalentToSong<T>{
	(song: Song, data: T): boolean
}

export interface basePlayableConverter<T extends Song>{
	isPlayable: isPlayable<T>
	upgradeToPlayable: upgradeToPlayable<T>
	directUpgradeToPlayable: directUpgradeToPlayable<T>
}
export interface playableConverter<T1 extends Song, T2> extends basePlayableConverter<T1>{
	isEquivalentToSong: isEquivalentToSong<T2>
}

export interface songDefaultRequiredData{
	title: string,
	artist: string,
	album: string,
	duration: number
}
