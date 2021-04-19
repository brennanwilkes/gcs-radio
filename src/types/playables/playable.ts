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

export interface playableConverter<T1 extends Song, T2>{
	isPlayable: isPlayable<T1>
	upgradeToPlayable: upgradeToPlayable<T1>
	directUpgradeToPlayable: directUpgradeToPlayable<T1>
	isEquivalentToSong: isEquivalentToSong<T2>
}

export interface songDefaultRequiredData{
	title: string,
	artist: string,
	album: string,
	duration: number
}
