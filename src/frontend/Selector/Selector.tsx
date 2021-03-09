import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';

import "./selector.css";

import FloatingLabel from "react-bootstrap-floating-label";
import SongRow, {getSongKey} from "../SongRow/SongRow";
import HrWrapper from "../HrWrapper/HrWrapper";


interface IProps {
	songChangeCallback: ((songs: Song[]) => void),
	setProcessing: ((state: boolean) => void)
}
interface IState {
	queriedSongs: Song[],
	songs: Song[],
	cogs: boolean[],
}

export default class Selector extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.setCog = this.setCog.bind(this);

		this.state = {
			queriedSongs: [],
			songs: [],
			cogs: [false, false, false]
		}
	}

	componentDidUpdate(_prevProps: IProps, prevState: IState){
		if(this.state.songs !== prevState.songs){
			this.props.songChangeCallback(this.state.songs);
		}
		if(this.state.cogs !== prevState.cogs){
			this.props.setProcessing(this.state.cogs.reduce((prev, cur) => prev || cur));
		}
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

	setCog(cog: number, setting: boolean){
		let cogs = this.state.cogs;
		cogs[cog] = setting;
		this.setState({
			cogs: cogs
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
			<div className="Selector">
				<HrWrapper style={{
					borderBottomColor: "#CCC"
				}} children={
					<h2>Search</h2>
				} />
				<FloatingLabel
					label="Search Text"
					onChange={(event) => {
						this.setCog(0,true);
						this.handleSearch(event, "query").then(songs => {
							this.setCog(0,false);
							this.setState({
								queriedSongs: songs
							})
						}).catch(err => {
							this.setCog(0,false);
							console.error(err);
						});
					}}
					onChangeDelay={500}
					loadingCog={this.state.cogs[0]}
					loadingCogSpinning={this.state.cogs[0]} />

				<FloatingLabel
					label="Load Spotify URL"
					onChange={(event) => {
						this.setCog(1,true);
						this.handleSearch(event, "spotifyId").then(songs => {
							this.setCog(1,false);
							this.setState({
								songs: [...this.state.songs, ...songs]
							})
						}).catch(err => {
							this.setCog(1,false);
							console.error(err);
						});
					}}
					onChangeDelay={250}
					loadingCog={this.state.cogs[1]}
					loadingCogSpinning={this.state.cogs[1]} />
				<FloatingLabel
					label="Load YouTube URL (Coming soon)"
					loadingCog={this.state.cogs[2]}
					loadingCogSpinning={this.state.cogs[2]} />

				<ul className="searchResults">{querySongsDisplay}</ul>
				<HrWrapper style={{
					borderBottomColor: "#CCC"
				}} children={
					<h2>Selected Songs</h2>
				} />
				<ul className="songsDisplay">{songsDisplay}</ul>
			</div>
		</>
	}
}