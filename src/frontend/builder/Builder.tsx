import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';

import "./Builder.css";
import FloatingLabel from "react-bootstrap-floating-label";
import SongRow, {getSongKey} from "../SongRow/SongRow";

interface IProps {}
interface IState {
	queriedSongs: Song[],
	songs: Song[]
}

export default class Builder extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);

		this.state = {
			queriedSongs: [],
			songs: []
		}
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
				<FloatingLabel label="Search Songs" onChange={(event) => {
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
				<ul className="searchResults">{querySongsDisplay}</ul>
				<h2>Songs</h2>
				<ul>{songsDisplay}</ul>
			</div>

		</>
	}
}
