import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';
import {PlaylistObj} from "../../types/playlist";

import "./builder.css";

import Selector from "../Selector/Selector";
import PlaylistDetailAdder, {Details} from "../PlaylistDetailAdder/PlaylistDetailAdder";

import {UserWithId} from "../../types/user";

interface IProps {
	redirectCallback: ((playlist: string) => void),
	playlist?: string
}
interface IState {
	songs: Song[],
	rendering: boolean,
	processing: boolean,
	loadedProgress: number,
	rendered : boolean,
	details: Details,
	completeSongs?: Song[],
	user?: UserWithId,
	patchMode: boolean,
	initialName?: string,
	initialDescription?: string,
	initialPrivate?: boolean

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
			details: {},
			patchMode: false
		}

		if(this.props.playlist){
			axios.get(`../api/v1/playlists/${this.props.playlist}`).then(res => {
				if(res?.data?.playlists && res.data.playlists.length > 0 && res.data.playlists[0].songs && res.data.playlists[0].songs.length > 0){
					const p = res.data.playlists[0];
					this.setState({
						songs: p.songs,
						patchMode: true,
						initialName: p.details.name,
						initialDescription: p.details.description,
						initialPrivate: p.private,
					});
				}
			}).catch(console.error);
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

		let features = this.state.details?.selected ?? [];
		features = features.map(id =>
			this.state.completeSongs?.filter(
				s => s.spotifyId === id.split(":")[0] && s.youtubeId === id.split(":")[1]
			)[0]?.id ?? "UNDEFINED"
		);
		features = [...features, ...((this.state.completeSongs ?? []).filter(
			s => !features.includes(s.id ?? "UNDEFINED")
		).map(
			song => song.id ?? "UNDEFINED"
		))].slice(0,3);

		const args = (this.state.details.name && this.state.details.name.length)
			? {
				songs: this.state.completeSongs?.map(song => song.id),
				user: this.state.user?.id,
				name: this.state.details?.name,
				description: this.state.details?.description,
				features,
				private: this.state.details?.private ?? true
			} : {
				private: false,
				songs: this.state.completeSongs?.map(song => song.id)
			};

		axios[this.state.patchMode ? "patch" : "post"](
			`/api/v1/playlists${this.state.patchMode ? `/${this.props.playlist}` : ""}`,
			args,
			{ withCredentials: true }
		).then(resp => {
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

			//Gotta love ES6 amiright??
			const songs = this.state.songs.filter((v,i,a) => a.findIndex(t => (t.spotifyId === v.spotifyId && t.youtubeId===v.youtubeId)) === i);
			new PlaylistObj(songs).render(song => {
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
			<div className="Builder p-2 py-sm-3 py-md-4 px-sm-1 px-md-0">
				<h1>GCS Radio</h1>
				{
					this.state.rendered
					? <PlaylistDetailAdder
						detailCallback={this.updateDetails}
						songs={this.state.songs}
						initialName={this.state.initialName}
						initialDescription={this.state.initialDescription}
						initialPrivate={this.state.initialPrivate} />
					: <Selector
						initialSongs={this.state.songs}
						songChangeCallback={this.songChangeCallback}
						setProcessing={this.proccessingCallback} />
				}
				<button
					disabled={this.state.rendering || this.state.processing || this.state.songs.length === 0}
					onClick={this.renderPlaylist}
					className={`container mb-0 btn btn-lg btn-${this.state.rendering || this.state.processing ? "secondary" : "primary"}`}>{
					this.state.rendering
					? `Loading ${Math.min(this.state.loadedProgress + 1, this.state.songs.length)}/${this.state.songs.length}`
					: (this.state.rendered ? "Submit" : "Build Playlist")
				}</button>
			</div>
		</>
	}
}
