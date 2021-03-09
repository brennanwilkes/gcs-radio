import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';
import {PlaylistObj} from "../../types/playlist";

import "./builder.css";
import "../App/app.css";

import Selector from "../Selector/Selector";
import PlaylistDetailAdder, {Details} from "../PlaylistDetailAdder/PlaylistDetailAdder";

import {UserWithId} from "../../types/user";

interface IProps {
	redirectCallback: ((playlist: string) => void)
}
interface IState {
	songs: Song[],
	rendering: boolean,
	processing: boolean,
	loadedProgress: number,
	rendered : boolean,
	details: Details,
	completeSongs?: Song[],
	user?: UserWithId
}

export default class Builder extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.renderPlaylist = this.renderPlaylist.bind(this);
		this.songChangeCallback = this.songChangeCallback.bind(this);
		this.proccessingCallback = this.proccessingCallback.bind(this);
		this.updateDetails = this.updateDetails.bind(this);
		this.postPlaylist = this.postPlaylist.bind(this);

		this.state = {
			songs: [],
			rendering: false,
			processing: false,
			loadedProgress: 0,
			rendered: false,
			details: {}
		}
	}

	songChangeCallback(songs: Song[]){
		this.setState({songs});
	}
	proccessingCallback(processing: boolean){
		this.setState({processing});
	}
	updateDetails(details: Details){
		this.setState({details});
	}

	postPlaylist(){
		const args = (this.state.details.name && this.state.details.name.length)
			? {
				songs: this.state.completeSongs?.map(song => song.id),
				user: this.state.user?.id,
				name: this.state.details?.name,
				description: this.state.details?.description,
				features: this.state.completeSongs?.map(song => song.id).slice(0,3)
			} : {
				songs: this.state.completeSongs?.map(song => song.id)
			};
		axios.post('/api/v1/playlists', args, { withCredentials: true }).then(resp => {
			if(resp.data.playlists && resp.data.playlists.length > 0 && resp.data.playlists[0].songs){
				this.props.redirectCallback(resp.data.playlists[0].id);
			}
		}).catch(console.error);
	}

	renderPlaylist(){
		if(this.state.rendered){
			this.postPlaylist();
		}
		else{
			this.setState({
				rendering: true
			});
			new PlaylistObj(this.state.songs).render(song => {
				console.log(`Loaded "${song.title}"`);
				this.setState({
					loadedProgress: this.state.loadedProgress + 1
				})
			}).then(complete => {
				this.setState({
					completeSongs: complete.songs
				});
				axios.get("/auth").then(resp => {
					this.setState({
						rendered: true,
						rendering: false,
						user: resp.data.users[0]
					});
				}).catch(() => {
					this.postPlaylist();
				});
			}).catch(console.error);
		}
	}

	render(){
		return <>
			<div className="App">
				<h1>GCS Radio</h1>
				<div className="Builder">
					{
						this.state.rendered
						? <PlaylistDetailAdder detailCallback={this.updateDetails} />
						: <Selector songChangeCallback={this.songChangeCallback} setProcessing={this.proccessingCallback} />
					}
					<button
						disabled={this.state.rendering || this.state.processing || this.state.songs.length === 0}
						onClick={this.renderPlaylist}
						className={`btn btn-${this.state.rendering || this.state.processing ? "secondary" : "primary"}`}>{
						this.state.rendering
						? `Loading ${Math.min(this.state.loadedProgress + 1, this.state.songs.length)}/${this.state.songs.length}`
						: (this.state.rendered ? "Submit" : "Build Playlist")
					}</button>
				</div>
			</div>
		</>
	}
}
