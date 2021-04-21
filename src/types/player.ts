import { Song } from "./song";

/* eslint-disable no-unused-vars */
export enum PlayerEvent{
	end = "end",
	error = "error"
}
/* eslint-enable no-unused-vars */

export interface Player{
	on(event: PlayerEvent, callback: (data?: Error) => void): Promise<void>
	initialize(): Promise<void>
	seek(newPosition?: number): Promise<number>
	setSong(song: Song): Promise<void>
	play(): Promise<void>
	pause(): Promise<void>
	volume(newVolume?: number): Promise<number>
}

export abstract class DefaultPlayer implements Player {
	errorHandler: (err: Error) => void = console.error;
	songEndHandler?: () => void;
	on (event: string, callback: (data?: Error) => void): Promise<void> {
		if (event === "end") {
			this.errorHandler = callback;
			return Promise.resolve();
		} else if (event === "error") {
			this.songEndHandler = callback;
			return Promise.resolve();
		} else {
			return Promise.reject(new Error(`Invalid event type ${event}`));
		}
	}

	abstract initialize(): Promise<void>
	abstract seek(newPosition?: number): Promise<number>
	abstract setSong(song: Song): Promise<void>
	abstract play(): Promise<void>
	abstract pause(): Promise<void>
	abstract volume(newVolume?: number): Promise<number>
}
