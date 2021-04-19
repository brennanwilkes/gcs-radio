import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';
import {Playlist, PlaylistObj} from "../../types/playlist";

import "./builder.css";

import Selector from "../Selector/Selector";
import PlaylistDetailAdder, {Details} from "../PlaylistDetailAdder/PlaylistDetailAdder";
import NavBar from "../Navbar/Navbar";

import {UserWithId} from "../../types/user";
import Response, {HasResponse, axiosErrorResponseHandler, errorResponseHandler, successResponseHandler} from "../Response/Response";

import {useTranslation} from "react-i18next";

const Play = () => <>{useTranslation("common").t("selector.play")}</>
const Details = () => <>{useTranslation("common").t("selector.details")}</>
const Edit = () => <>{useTranslation("common").t("selector.edit")}</>
const Save = () => <>{useTranslation("common").t("selector.save")}</>
const Loading = () => <>{useTranslation("common").t("selector.loading")}</>

interface IProps {
	redirectCallback: ((playlist: string) => void),
	playlist?: string
}
interface IState extends HasResponse{
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
	initialPrivate?: boolean,
	addDetails: boolean,
	postedPlaylistId?: string,
	shouldRedirect: boolean,
}

export default class Builder extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.renderPlaylist = this.renderPlaylist.bind(this);
		this.songChangeCallback = this.songChangeCallback.bind(this);
		this.proccessingCallback = this.proccessingCallback.bind(this);
		this.updateDetails = this.updateDetails.bind(this);
		this.postPlaylist = this.postPlaylist.bind(this);
		this.setPlayList = this.setPlayList.bind(this);
		this.setUser = this.setUser.bind(this);

		this.state = {
			songs: [],
			rendering: false,
			processing: false,
			loadedProgress: 0,
			rendered: false,
			details: {},
			patchMode: false,
			addDetails: false,
			shouldRedirect: false,
		}

		if(this.props.playlist){
			axios.get(`../api/v1/playlists/${this.props.playlist}`).then(res => {
				if(res?.data?.playlists && res.data.playlists.length > 0 && res.data.playlists[0].songs && res.data.playlists[0].songs.length > 0){
					this.setPlayList(res.data.playlists[0]);
				}
			}).catch(axiosErrorResponseHandler(this));
		}
	}

	componentDidUpdate(_: IProps, prevState: IState){
		if((prevState.postedPlaylistId !== this.state.postedPlaylistId || prevState.shouldRedirect !== this.state.shouldRedirect) && this.state.postedPlaylistId && this.state.shouldRedirect){
			this.setState({
				shouldRedirect: false
			});
			this.props.redirectCallback(this.state.postedPlaylistId);
		}
	}

	setUser(playlistCompare?: Playlist){
		axios.get("/auth").then(resp => {
			this.setState({
				user: resp.data.users[0],
				patchMode: playlistCompare?.details?.user && resp.data.users[0] && playlistCompare.details.user === resp.data.users[0]?.id
			});
		}).catch(() => {
			this.setState({
				patchMode: false,
				user: undefined
			});
		});
	}

	setPlayList(p: Playlist, printMessage: boolean = true){
		if(p.id){
			this.setState({
				postedPlaylistId: p.id
			});
		}
		this.setState({
			songs: p.songs,
			initialPrivate: p.private,
		});
		if(p.details){
			this.setState({
				initialName: p.details.name,
				initialDescription: p.details.description,
			});
		}
		if(printMessage){
			successResponseHandler(this)(`Loaded ${p.details?.name ?? "playlist"}`);
		}
		this.setUser(p);
	}

	componentDidMount(){
		this.setUser();
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

	switchToAddDetails(){
		this.setState({
			addDetails: true
		});
	}

	postPlaylist(printMessage: boolean = true): Promise<void>{
		return new Promise<void>((resolve, reject) => {
			let features = this.state.details?.selected ?? [];
			features = features.map(id =>
				this.state.completeSongs?.filter(
					s => s.spotifyId === id.split(":")[0] && s.youtubeId === id.split(":")[1] && s.musicKitId === id.split(":")[2]
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
				if(resp.data.playlists && resp.data.playlists.length > 0){
					this.setPlayList(resp.data.playlists[0], printMessage);
				}
				this.setState({
					addDetails: false
				});
				resolve();
			}).catch(reject);
		});
	}

	renderPlaylist(printMessage: boolean = true): Promise<void>{
		return new Promise<void>((resolve, reject) => {
			this.setState({
				rendering: true
			});

			//Gotta love ES6 amiright??
			const songs = this.state.songs.filter((v,i,a) => a.findIndex(t => (t.spotifyId === v.spotifyId && t.youtubeId===v.youtubeId && t.musicKitId === v.musicKitId)) === i);
			new PlaylistObj(songs).render(song => {
				if(printMessage){
					successResponseHandler(this)(`Loaded "${song.title}"`);
				}
				this.setState({
					loadedProgress: this.state.loadedProgress + 1
				})
			}).then(complete => {
				this.setState({
					completeSongs: complete.songs
				});
				this.setState({
					rendered: true,
					rendering: false
				});
				resolve();
			}).catch(reject);
		});
	}


	render(){
		const disabled = (this.state.rendering || this.state.processing || this.state.songs.length === 0);

		return <>
			<NavBar />
			<div className="Builder p-2 py-sm-3 py-md-4 px-sm-1 px-md-0">
				{
					this.state.addDetails
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
				<div className="container-lg">
					{
						this.state.user ? <>
						<button
							disabled={disabled}
							onClick={() => {
								if(this.state.addDetails){
									if(this.state.details.name && this.state.details.name.length){
										this.renderPlaylist(!this.state.addDetails).then(() => {
											return this.postPlaylist(!this.state.addDetails);
										}).then(() => {
											successResponseHandler(this)(`${this.state.initialName ?? "Playlist"} saved`);
										}).catch(errorResponseHandler(this));
									}
									else{
										errorResponseHandler(this)(`Playlist saving requires a name`);
									}
								}
								else{
									this.setState({
										addDetails: true
									});
									$("html, body").animate({ scrollTop: 0 }, "slow");
								}
							}}
							className={`container mb-0 btn btn-lg text-gcs-${disabled ? "alpine" : "base"} btn-gcs-${disabled ? "elevated" : "bright"}`}>{
							this.state.rendering
							? <><Loading />{` ${Math.min(this.state.loadedProgress + 1, this.state.songs.length)}/${this.state.songs.length}`}</>
							: (this.state.addDetails ? <Save /> : (this.state.patchMode ? <Edit /> : <Details />))
						}</button>
						</> : <></>
					}
					<button
						disabled={disabled}
						onClick={() => {
							if(!(this.state.rendered && this.state.completeSongs && this.state.completeSongs.length === this.state.songs.length)){
								this.renderPlaylist().then(() => {
									return this.postPlaylist();
								}).then(() => {
									this.setState({
										shouldRedirect: true
									});
								}).catch(errorResponseHandler);
							}
							else{
								this.setState({
									shouldRedirect: true
								});
							}
						}}
						className={`container mt-2 mb-0 btn btn-lg text-gcs-${disabled ? "alpine" : "base"} btn-gcs-${disabled ? "elevated" : "faded"}`}>{
							this.state.rendering && !this.state.user
							? <><Loading />{` ${Math.min(this.state.loadedProgress + 1, this.state.songs.length)}/${this.state.songs.length}`}</>
							: <Play />
					}</button>
				</div>
			</div>
			<Response response={this.state} />
		</>
	}
}
