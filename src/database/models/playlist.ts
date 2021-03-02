// Brennan Wilkes

// Import and setup
import { mongoose } from "../connection";
import { Playlist, PlaylistObj } from "../../types/playlist";
import { SongObjFromQuery } from "../../types/song";
import SongModel, { SongDoc } from "./song";
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
	songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "songs" }]
});

export interface PlaylistDoc extends mongoose.Document {
	songs: mongoose.Schema.Types.ObjectId[]
}

const PlaylistModel = mongoose.model<PlaylistDoc>("playlist", PlaylistSchema);
export default PlaylistModel;

export function PlaylistModelFromPlaylist (playlist: Playlist): InstanceType<typeof PlaylistModel> {
	return new PlaylistModel({
		songs: playlist.songs.filter(song => song.id).map(song => new mongoose.Schema.Types.ObjectId(song.id as string))
	});
}

export function PlaylistObjFromQuery (docs: PlaylistDoc): Promise<Playlist> {
	return new Promise<Playlist>((resolve, reject) => {
		const songs = docs.songs.map(id => SongModel.findOne({ _id: id }));
		Promise.all(songs).then(results => {
			if (results && results.length > 0) {
				const filtered: SongDoc[] = results.filter((song): song is SongDoc => song !== null);
				resolve(new PlaylistObj(filtered.map(song => new SongObjFromQuery(song)), String(docs._id)));
			} else {
				reject(new Error("No results found!"));
			}
		}).catch(reject);
	});
}

export { PlaylistSchema };
