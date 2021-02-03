// Brennan Wilkes

// Import and setup
import { mongoose } from "../connection";
import { VideoData } from "../../backend/videoData";
const Schema = mongoose.Schema;

const SongSchema = new Schema({
	audioId: { type: mongoose.Schema.Types.ObjectId, ref: "songs.files" },
	upload_date: { type: String },
	duration: { type: String },
	fullTitle: { type: String },
	album: { type: String },
	youtubeTitle: { type: String },
	youtubeID: { type: String },
	tags: [String],
	songTitle: { type: String },
	artist: { type: String }
});

const Song = mongoose.model("song", SongSchema);
export default Song;
export function SongFromInfo (info: VideoData, audioId: string): InstanceType<typeof Song> {
	return new Song({
		audioId: new mongoose.Types.ObjectId(audioId),
		upload_date: info.upload_date,
		duration: info.duration,
		fullTitle: info.fulltitle,
		album: info.album,
		youtubeTitle: info.title,
		youtubeID: info.id,
		tags: info.tags,
		songTitle: info.track,
		artist: info.artist
	});
}
