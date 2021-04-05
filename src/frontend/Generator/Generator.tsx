import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';
import {Playlist, PlaylistObj} from "../../types/playlist";


import Selector from "../Selector/Selector";
import NavBar from "../Navbar/Navbar";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Response, {HasResponse, errorResponseHandler, axiosErrorResponseHandler} from "../Response/Response";
import "./generator.scss";

import {useTranslation} from "react-i18next";

const Play = () => <>{useTranslation("common").t("selector.play")}</>
const Loading = () => <>{useTranslation("common").t("selector.loading")}</>


const keys = [
	"acousticness",
	"danceability",
	"energy",
	"instrumentalness",
	"key",
	"loudness",
	"mode",
	"tempo",
	"valence"
];

interface IProps {
	redirectCallback: ((playlist: string) => void),
}
interface IState extends HasResponse{
	songs: Song[],
	rendering: boolean,
	processing: boolean,
	rendered : boolean,
	completeSongs?: Song[],
	shouldRedirect: boolean,
	postedPlaylistId?: string,

	acousticness: number,
	hasAcousticness: boolean,
	danceability: number,
	hasDanceability: boolean,
	energy: number,
	hasEnergy: boolean,
	instrumentalness: number,
	hasInstrumentalness: boolean,
	key: number,
	hasKey: boolean,
	loudness: number,
	hasLoudness: boolean,
	mode: boolean,
	hasMode: boolean,
	tempo: number,
	hasTempo: boolean,
	valence: number,
	hasValence: boolean,
}

export default class Generator extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.renderPlaylist = this.renderPlaylist.bind(this);
		this.songChangeCallback = this.songChangeCallback.bind(this);
		this.proccessingCallback = this.proccessingCallback.bind(this);
		this.postPlaylist = this.postPlaylist.bind(this);
		this.setPlayList = this.setPlayList.bind(this);

		this.state = {
			songs: [],
			rendering: false,
			processing: false,
			rendered: false,
			shouldRedirect: false,

			acousticness: 50,
			hasAcousticness: false,
			danceability: 50,
			hasDanceability: false,
			energy: 50,
			hasEnergy: false,
			instrumentalness: 50,
			hasInstrumentalness: false,
			key: 0,
			hasKey: false,
			loudness: 50,
			hasLoudness: false,
			mode: false,
			hasMode: false,
			tempo: 50,
			hasTempo: false,
			valence: 50,
			hasValence: false,

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


	songChangeCallback(songs: Song[]){
		this.setState({songs});
	}
	proccessingCallback(processing: boolean){
		this.setState({processing});
	}

	setPlayList(p: Playlist){
		if(p.id){
			this.setState({
				postedPlaylistId: p.id
			});
		}
		this.setState({
			songs: p.songs,
		});
	}


	postPlaylist(): Promise<void>{
		this.setState({
			processing: true
		});
		return new Promise<void>((resolve, reject) => {
			const args = {
				private: false,
				songs: this.state.completeSongs?.map(song => song.id)
			};

			keys.forEach(key => {
				if((this.state as any)[`has${key.slice(0,1).toUpperCase()}${key.slice(1)}`]){
					let val = (this.state as any)[key];
					if(key === "mode"){
						val = (val === 1);
					}
					else if(key === "tempo"){
						val *= 2;
					}
					else if(key === "loudness"){
						val = (val * 2) - 100;
					}
					else if(key !== "key"){
						val /= 100;
					}

					(args as any)[key] = val;
				}
			});
			axios.post(
				`/api/v1/playlists/generate`,
				args,
				{ withCredentials: true }
			).then(resp => {
				if(resp.data.playlists && resp.data.playlists.length > 0){
					this.setPlayList(resp.data.playlists[0]);
				}
				resolve();
			}).catch(reject).finally(() => {
				this.setState({
					processing: false
				});
			});
		});
	}

	renderPlaylist(): Promise<void>{
		return new Promise<void>((resolve, reject) => {
			this.setState({
				rendering: true
			});

			//Gotta love ES6 amiright??
			const songs = this.state.songs.filter((v,i,a) => a.findIndex(t => (t.spotifyId === v.spotifyId && t.youtubeId===v.youtubeId)) === i);
			new PlaylistObj(songs).render().then(complete => {
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

		const sliders = keys.map(key => {
			const capKey = `${key.slice(0,1).toUpperCase()}${key.slice(1)}`;
			return <>
				<div className="row my-3">
					<h4
						className={`h3 text-gcs-${(this.state as any)[`has${capKey}`] ? "faded": "elevated" } col-12 col-md-3 my-0`}
						onClick={() => {
							const state: any = {};
							state[`has${capKey}`] = !((this.state as any)[`has${capKey}`]);
							this.setState({...state});
						}}
					>{capKey}</h4>
					<div className={`${(this.state as any)[`has${capKey}`] ? "" : "controller-disabled"} controller col-12 col-md-8`}>
						<Slider
							min={0}
							max={key === "key" ? 11 : (key === "mode" ? 1 : 100)}
							value={(this.state as any)[key]}
							onChange={(value: number) => {
								const state: any = {};
								state[key] = value;
								state[`has${capKey}`] = true;
								this.setState({...state});
							}}
						/>
					</div>
				</div>
			</>;
		})


		return <>
			<NavBar />
			<div className={`Generator p-2 py-sm-3 pb-md-4 px-sm-1 px-md-0 ${this.state.rendering || this.state.processing ? "GeneratorProcessing" : ""}`}>
				<div className="container-lg"><p className="my-2 my-md-4 text-gcs-alpine">
					Select between 1 and 5 "seed" songs to base your playlist on
				</p></div>
				<Selector
					songChangeCallback={this.songChangeCallback}
					setProcessing={this.proccessingCallback} />
				<div className="container-lg mt-2">
					{
						sliders
					}
					<button
						disabled={disabled}
						onClick={() => {
							this.renderPlaylist().then(() => {
								return this.postPlaylist();
							}).then(() => {
								this.setState({
									shouldRedirect: true
								});
							}).catch(axiosErrorResponseHandler(this));
						}}
						className={`container mt-2 my-4 btn btn-lg text-gcs-${disabled ? "alpine" : "base"} btn-gcs-${disabled ? "elevated" : "faded"}`}>{
							this.state.rendering
							? <Loading />
							: <Play />
					}</button>
				</div>
			</div>
			<Response response={this.state} />
		</>
	}
}
