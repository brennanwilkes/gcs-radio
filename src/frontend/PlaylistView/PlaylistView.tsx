import * as React from "react";
import axios from "axios";

import {Playlist} from '../../types/playlist';
import {Song} from '../../types/song';
import arrayShuffle from "array-shuffle";

import {WrappedSongPolaroid} from "../SongPolaroid/SongPolaroid";

import "./playlistView.scss";

export interface FakePlaylist{
	features: Song[],
	name: string,
	description: string,
	playCallback: () => void
}

interface IProps {
	playlist?: Playlist,
	fakePlaylist?: FakePlaylist,
	keyExtension: number,
	className?: string
	first?: boolean,
	last?: boolean,
	deleteCallback?: (playlist: Playlist, i: number) => void
}
interface IState {
	features: Song[],
	name: string,
	description: string
}


export default class PlaylistView extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props);
		this.state = {
			features: [],
			name: "",
			description: ""
		};
	}

	componentDidMount(){
		Promise.all((this.props.playlist?.details?.features ?? []).map(id => axios.get(`../api/v1/songs/${encodeURIComponent(id)}`))).then(res => {
			let features: Song[] = res.filter(data => data.data.songs && data.data.songs.length > 0).map(data => data.data.songs[0]);
			features = arrayShuffle(features);
			this.setState({
				features,
			});
			if(this.props.last){
				$("body").css("cursor","inherit");
			}
		});
		if(this.props.fakePlaylist){
			this.setState({
				features: this.props.fakePlaylist.features,
				name: this.props.fakePlaylist.name,
				description: this.props.fakePlaylist.description
			});
		}
		else{
			this.setState({
				name: this.props.playlist?.details?.name ?? "Unknown",
				description: this.props.playlist?.details?.description ?? "Unknown"
			});
		}
	}

	render(){
		const playlist = this.props.playlist;
		const id = playlist ? playlist.id : (this.props.fakePlaylist ? this.props.fakePlaylist.name + this.props.fakePlaylist.description : "UNKNOWN");
		const ext = this.props.keyExtension;
		return <>
			<div
				key={`${id}${ext}`}
				className={`${this.props.className ?? ""} PlaylistView mx-0 container-lg row ${ !this.props.first ? "my-BIG" : "mb-BIG mt-4"} pl-md-5`}
			>
				<div className="featureDisplay px-0 px-0 col-12 col-md-3 col-xl-4 mx-0"><div className="container-fluid row">{
					this.state.features.map((song, i) => <WrappedSongPolaroid
						key={`${id}${song.id}-${ext}`}
						className="col-12 mb-0"
						song={song}
						cutoff={screen.width > 1200 ? 24 : 12}
						keyExtension={`${id}${ext}-${i}`} />)
				}</div></div>
				<div className={`playlistDetails px-0 px-0 col-12 col-md-9 col-xl-8 ${this.state.features.length > 1 ? "pl-md-BIG" : ""}`}>
					<h2 className="text-gcs-alpine">{this.state.name}</h2>
					<h4 className="text-gcs-faded">{this.state.description}</h4>
					<div className="playlistControls mt-3">
						{
							playlist ? <>
								<a
									className="btn btn-lg btn-gcs-faded px-4"
									href={`../app?playlist=${encodeURIComponent(playlist.id as string)}`}>
									Play
								</a>
								<a className="btn btn-lg btn-gcs-bright px-4" href={`../builder?playlist=${encodeURIComponent(playlist.id as string)}`}>Edit</a>
							</> : <>
								<button
									className="btn btn-lg btn-gcs-faded px-4"
									onClick={() => {
										if(this.props.fakePlaylist){
											this.props.fakePlaylist.playCallback();
										}
									}}>
									Play
								</button>
							</>
						}
						{
							this.props.deleteCallback && playlist ? <button className="btn btn-lg btn-gcs-loud px-4" onClick={() => {
								if(this.props.deleteCallback){
									this.props.deleteCallback(playlist, this.props.keyExtension);
								}
							}}>Delete</button> : <></>
						}

					</div>
				</div>
			</div>
		</>
	}
}
