import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';
import {PlaylistObj} from "../../types/playlist";

import "./Builder.css";
import FloatingLabel from "react-bootstrap-floating-label";
import SongRow, {getSongKey} from "../SongRow/SongRow";
import HrWrapper from "../HrWrapper/HrWrapper";
import LoadingCog from "../LoadingCog/LoadingCog";

interface IProps {
	loadSongsCallback: ((songs: Song[]) => void)
}
interface IState {
	queriedSongs: Song[],
	songs: Song[]
}

export default class Builder extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.renderPlaylist = this.renderPlaylist.bind(this);

		this.state = {
			queriedSongs: [],
			songs: []
		}
	}

	renderPlaylist(){
		const playlist = new PlaylistObj(this.state.songs);

		playlist.render(song => {
			console.log(`Loaded "${song.title}"`);
		}).then(complete => {
			axios.post('/api/v1/playlists', {
				songs: complete.songs.map(song => song.id)
			}).then(resp => {
				if(resp.data.playlists && resp.data.playlists.length > 0 && resp.data.playlists[0].songs){
					this.props.loadSongsCallback(resp.data.playlists[0].songs);
				}
			}).catch(console.error);
		});
	}

	handleSearch(event: React.FormEvent, queryParam: string): Promise<Song[]>{
		return new Promise<Song[]>((resolve, reject) => {
			const query = encodeURIComponent((event.target as HTMLTextAreaElement).value);
			if(query){
				axios.get(`/api/v1/search?${queryParam}=${query}`).then(res => {
					resolve(res.data.songs);
				}).catch(reject);
			}
			else {
				resolve([])
			}
		});
	}

	render(){

		const querySongsDisplay = this.state.queriedSongs.map((song) => <SongRow
			key={getSongKey(song)}
			song={song}
			isHoverable={true}
			onClick={(song) => {
				this.setState({
					queriedSongs: [],
					songs: [...this.state.songs, song]
				});
			}}
		/> );

		const songsDisplay = this.state.songs.map((song) => <SongRow key={getSongKey(song)} song={song} keyExtension="selected" />);

		return <>
			<div className="Builder">
				<HrWrapper style={{
					borderBottomColor: "#CCC"
				}} children={
					<h2>Search</h2>
				} />
				<div className="searchWrapper">
					<FloatingLabel
						label="Search Text"
						onChange={(event) => {
							this.handleSearch(event, "query").then(songs => {
								this.setState({
									queriedSongs: songs
								})
							}).catch(console.error);
						}}
						onChangeDelay={500}
						loadingCog={true}
						loadingCogSpinning={true}
						loadingCogSize={30} />
				</div>

				<FloatingLabel
					label="Load Spotify Playlist URL"
					onChange={(event) => {
						this.handleSearch(event, "playlistId").then(songs => {
							this.setState({
								songs: [...this.state.songs, ...songs]
							})
						}).catch(console.error);
					}}
					onChangeDelay={250}
					loadingCog={true}
					loadingCogSpinning={true}
					loadingCogSize={30} />
				<FloatingLabel
					label="Load YouTube URL (Coming soon)"
					loadingCog={true}
					loadingCogSpinning={true}
					loadingCogSize={30} />

				<ul className="searchResults">{querySongsDisplay}</ul>
				<HrWrapper style={{
					borderBottomColor: "#CCC"
				}} children={
					<h2>Selected Songs</h2>
				} />
				<ul>{songsDisplay}</ul>

				<button onClick={this.renderPlaylist} className="btn btn-success">Build Playlist{this.state.songs.length > 0 ? ` (This may take up to ${this.state.songs.length * 7 + 5}s)` : ""}</button>
			</div>
		</>
	}
}
