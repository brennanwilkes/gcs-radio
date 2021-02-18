// Brennan Wilkes

// Import and setup
import { mongoose } from "../connection";
import { Song } from "../../types/song";
const Schema = mongoose.Schema;

const SongSchema = new Schema({
	title: { type: String },
	artist: { type: String },
	album: { type: String },
	duration: { type: Number },
	explicit: { type: Boolean },
	spotifyId: { type: String },
	artistSpotifyId: { type: String },
	albumSpotifyId: { type: String },
	youtubeId: { type: String },
	audioId: { type: mongoose.Schema.Types.ObjectId, ref: "audio.files" },
	tags: [String],
	thumbnailUrl: { type: String },
	releaseDate: { type: String }
});

export interface SongDoc extends mongoose.Document {
	title: string,
	artist: string,
	album: string,
	duration: number,
	explicit: boolean,
	spotifyId: string,
	artistSpotifyId: string,
	albumSpotifyId: string,
	youtubeId: string,
	audioId: mongoose.Schema.Types.ObjectId,
	tags: string[],
	thumbnailUrl: string,
	releaseDate: string
}

const SongModel = mongoose.model<SongDoc>("song", SongSchema);
export default SongModel;

export function SongModelFromSong (song: Song): InstanceType<typeof SongModel> {
	return new SongModel({
		title: song.title,
		artist: song.artist,
		album: song.album,
		duration: song.duration,
		explicit: song.explicit,
		spotifyId: song.spotifyId,
		artistSpotifyId: song.artistSpotifyId,
		albumSpotifyId: song.albumSpotifyId,
		youtubeId: song.youtubeId,
		tags: song.tags,
		thumbnailUrl: song.thumbnailUrl,
		releaseDate: song.releaseDate,
		audioId: song.audioId
	});
}

export { SongSchema };
