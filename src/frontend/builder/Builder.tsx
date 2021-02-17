import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';
import {PlaylistObj} from "../../types/playlist";

import "./Builder.css";
import FloatingLabel from "react-bootstrap-floating-label";
import SongRow, {getSongKey} from "../SongRow/SongRow";
import HrWrapper from "../HrWrapper/HrWrapper";

interface IProps {}
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
			console.log("Loaded song:");
			console.dir(song);
		}).then(complete => {
			console.log("Complete!");
			console.dir(complete);
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
				<FloatingLabel label="Search Text" onChange={(event) => {
					const query = encodeURIComponent((event.target as HTMLTextAreaElement).value);

					if(query){
						axios.get(`/api/v1/search?query=${query}`).then(res => {
							this.setState({
								queriedSongs:res.data.songs
							});
						}).catch(err => console.error(err));
					}
					else{
						this.setState({
							queriedSongs: []
						});
					}

				}} onChangeDelay={500}/>

				<FloatingLabel label="Load Spotify URL" />
				<FloatingLabel label="Load YouTube URL" />

				<ul className="searchResults">{querySongsDisplay}</ul>
				<HrWrapper style={{
					borderBottomColor: "#CCC"
				}} children={
					<h2>Selected Songs</h2>
				} />
				<ul>{songsDisplay}</ul>

				<button onClick={this.renderPlaylist} className="btn btn-success">Build Playlist</button>
			</div>
		</>
	}
}
