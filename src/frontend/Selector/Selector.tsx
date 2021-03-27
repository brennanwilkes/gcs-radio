import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';

import "./selector.css";

import FloatingLabel from "react-bootstrap-floating-label";
import SongRow, {getSongKey} from "../SongRow/SongRow";
import {WrappedSongPolaroid} from "../SongPolaroid/SongPolaroid";
import HrWrapper from "../HrWrapper/HrWrapper";
import Response, {HasResponse, axiosErrorResponseHandler} from "../Response/Response";


interface IProps {
	songChangeCallback: ((songs: Song[]) => void),
	setProcessing: ((state: boolean) => void),
	initialSongs?: Song[],
}
interface IState extends HasResponse{
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
			songs: this.props.initialSongs ?? [],
			cogs: [false, false, false]
		}
	}

	componentDidUpdate(prevProps: IProps, prevState: IState){
		if(this.state.songs !== prevState.songs){
			this.props.songChangeCallback(this.state.songs);
		}
		if(this.props.initialSongs !== prevProps.initialSongs && this.props.initialSongs){
			this.setState({
				songs: this.props.initialSongs
			});
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
		this.props.setProcessing(cogs.reduce((prev, cur) => prev || cur));
	}

	render(){

		const querySongsDisplay = this.state.queriedSongs.map((song, i) => <SongRow
			key={getSongKey(song, i)}
			song={song}
			isHoverable={true}
			onClick={(song) => {

				this.setState({
					queriedSongs: [],
					songs: [...this.state.songs, song]
				});
			}}
		/> );

		return <>
			<div className={`Selector container-lg${this.state.cogs.reduce((prev, cur) => prev || cur) ? " SelectorProcessing" : ""}`}>
				<HrWrapper style={{
					borderBottomColor: "var(--gcs-faded)"
				}} children={
					<h2 className="text-gcs-faded" >Search</h2>
				} />
				<FloatingLabel
					inputClassName="bg-gcs-elevated text-gcs-alpine"
					labelClassName="text-gcs-alpine"
					inputStyle={{
						border: "none"
					}}
					onChange={(event) => {
						this.setCog(0,true);
						this.handleSearch(event, "query").then(songs => {
							this.setCog(0,false);
							this.setState({
								queriedSongs: songs
							});
						}).catch(err => {
							this.setCog(0,false);
							axiosErrorResponseHandler(this)(err);
						});
					}}
					label="Search Text"
					onChangeDelay={500}
					loadingCog={this.state.cogs[0]}
					loadingCogSpinning={this.state.cogs[0]} />

				<FloatingLabel
					inputClassName="bg-gcs-elevated text-gcs-alpine"
					labelClassName="text-gcs-alpine"
					inputStyle={{
						border: "none"
					}}
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
							axiosErrorResponseHandler(this)(err);
						});
					}}
					onChangeDelay={250}
					loadingCog={this.state.cogs[1]}
					loadingCogSpinning={this.state.cogs[1]} />
				<FloatingLabel
					inputClassName="bg-gcs-elevated text-gcs-alpine"
					labelClassName="text-gcs-alpine"
					inputStyle={{
						border: "none"
					}}
					label="Load YouTube URL (Coming soon)"
					loadingCog={this.state.cogs[2]}
					loadingCogSpinning={this.state.cogs[2]} />

				<div className="searchResultsWrapper container-lg p-0 m-0">
					<ul className="searchResults p-0 mt-n2">{querySongsDisplay}</ul>
				</div>
				<HrWrapper style={{
					borderBottomColor: "var(--gcs-faded)"
				}} children={
					<h2 className="text-gcs-faded" >Selected Songs</h2>
				} />
				<div className="songsDisplay container-fluid row">{
					this.state.songs.map((song, i) => <WrappedSongPolaroid
						key={getSongKey(song, `main-${i}`)}
						className="col-xl-3 col-lg-4 col-md-6 col-xs-12 mb-0"
						song={song}
						isHoverable={true}
						isDeletable={true}
						onClick={(toDelete: Song) => {
							this.setState({
								songs: this.state.songs.filter(s => s.spotifyId !== toDelete.spotifyId || s.youtubeId !== toDelete.youtubeId)
							});
						}}
						keyExtension="selected" />)
				}</div>
			</div>
			<Response response={this.state} />
		</>
	}
}
