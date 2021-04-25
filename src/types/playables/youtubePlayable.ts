import { Song } from "../song";

export interface YoutubePlayable extends Song{
	youtubeId: string
}
