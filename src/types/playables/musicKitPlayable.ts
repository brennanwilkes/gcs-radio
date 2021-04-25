import { Song } from "../song";

export interface MusicKitPlayable extends Song{
	musicKitId: string
}
