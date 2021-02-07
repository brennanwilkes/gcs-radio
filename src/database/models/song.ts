// Brennan Wilkes

// Import and setup
import { mongoose } from "../connection";
import { VideoData } from "../../backend/types/videoData";
const Schema = mongoose.Schema;

const SongSchema = new Schema({
	audioId: { type: mongoose.Schema.Types.ObjectId, ref: "songs.files" },
	uploadDate: { type: String },
	duration: { type: String },
	fullTitle: { type: String },
	album: { type: String },
	youtubeTitle: { type: String },
	youtubeId: { type: String },
	tags: [String],
	songTitle: { type: String },
	thumbnailUrl: { type: String },
	artist: { type: String }
});

export interface SongDoc extends mongoose.Document {
	audioId: mongoose.Schema.Types.ObjectId,
	uploadDate: string,
	duration: string,
	fullTitle: string,
	album: string,
	youtubeTitle: string,
	youtubeId: string,
	tags: string[],
	songTitle: string,
	thumbnailUrl: string,
	artist: string
}

const Song = mongoose.model<SongDoc>("song", SongSchema);
export default Song;

export function SongFromInfo (info: VideoData, audioId: string): InstanceType<typeof Song> {
	return new Song({
		audioId: new mongoose.Types.ObjectId(audioId),
		uploadDate: info.uploadDate,
		duration: info.duration,
		fullTitle: info.fulltitle,
		album: info.album,
		youtubeTitle: info.title,
		youtubeId: info.id,
		tags: info.tags,
		songTitle: info.track,
		thumbnailUrl: info.thumbnails[0]?.url ?? "none",
		artist: info.artist
	});
}

export { SongSchema };