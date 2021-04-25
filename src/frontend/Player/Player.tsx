import * as React from "react";
import {Song} from '../../types/song';
import SongHowl, { iOS } from '../../types/songHowl';
import { FaRegPlayCircle, FaRegPauseCircle, FaStepForward, FaStepBackward } from 'react-icons/fa';
import {IconContext} from "react-icons";
import "./player.scss";
import { VoiceLineRender } from "../../types/voiceLine";
import {Howl} from "howler";

import jscookie from "js-cookie";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import {DirectAudioPlayer} from "./DirectAudioPlayer";
import {SpotifyPlayer} from "../spotifyWebSDK/spotify";
import {MusicKitPlayer} from "../musicKitSDK/musicKit";

const directAudioPlayer = new DirectAudioPlayer();
const spotifyPlayer = new SpotifyPlayer();
const musicKitPlayer = new MusicKitPlayer();

import Response, {HasResponse, successResponseHandler, errorResponseHandler, axiosErrorResponseHandler} from "../Response/Response";
import { Player } from "../../types/player";
import axios from "axios";

const bufferSize = 10;


interface IProps {
	songs: Song[],
	transitions: VoiceLineRender[],
	spotifySDKMode: boolean,
	updateVoice: (voice: string, label: string) => void,
	requestMoreSongs: (limit: number) => void,
}
interface IState extends HasResponse{
	paused: boolean,
	transitions: Howl[],
	progress: number,
	maxProgress: number,
	index: number,
	ready: boolean,
	unlocked: boolean,
	seekLock: boolean,
	lastTransition: number,
	playedIntro: boolean,
	volume: number,
	voice: string,
	playerInitialized: boolean
}

export default class App extends React.Component<IProps, IState> {

	player: Player = directAudioPlayer;

	constructor(props: IProps) {
		super(props);
		this.togglePause = this.togglePause.bind(this);
		this.transitionSong = this.transitionSong.bind(this);
		this.updateProgress = this.updateProgress.bind(this);
		this.setProgress = this.setProgress.bind(this);
		this.rewind = this.rewind.bind(this);
		this.initializeSongs = this.initializeSongs.bind(this);
		this.initializeTransitions = this.initializeTransitions.bind(this);
		this.loadedTransitionCallback = this.loadedTransitionCallback.bind(this);
		this.unlockMobileAudio = this.unlockMobileAudio.bind(this);
		this.playSong = this.playSong.bind(this);
		this.pauseSong = this.pauseSong.bind(this);
		this.setVolume = this.setVolume.bind(this);
		this.changeVoice = this.changeVoice.bind(this);
		this.updateVolume = this.updateVolume.bind(this);

		this.state = {
			playerInitialized: false,
			transitions: [],
			paused: true,
			progress: 0,
			maxProgress: 0,
			index: 0,
			ready: false,
			unlocked: false,
			seekLock: false,
			lastTransition: 0,
			playedIntro: false,
			volume: 100,
			voice: jscookie.get("voice") ?? "en-AU-Wavenet-B"
		};
	}

	updateProgress(){
		if(this.state.playerInitialized){
			this.player.seek().then(progress => {
				this.setState({
					progress
				});
			});
		}
	}

	initializeSongs(){
		if(this.state.index < this.props.songs.length){
			this.player.setSong(this.props.songs[this.state.index]).then(() => {
				successResponseHandler(this)(`Loaded ${this.props.songs[this.state.index].title}`);
				this.updateVolume();
				this.setState({
					ready: true,
					maxProgress: this.props.songs[0].duration
				});
			});
		}
	}

	unlockMobileAudio(){
		document.body.addEventListener('touchstart', () => {
			if(!this.state.unlocked){
				successResponseHandler(this)(`Mobile audio unlocked`);
				this.player.setSong(this.props.songs[this.state.index]).then(() => {
					return this.player.play();
				}).then(() => {
					return this.player.pause();
				}).then(() => {
					this.player.seek(0);
				}).catch(errorResponseHandler(this));
				this.state.transitions.forEach(audio => {
					audio.play();
					audio.pause();
					audio.seek(0);
				});
				this.setState({
					unlocked: true
				});
			}
		}, false);
	}

	loadedTransitionCallback(i: number, transitions: Howl[]){
		if(i + 1 < transitions.length){
			transitions[i + 1].load();
		}
	}

	initializeTransitions(){
		const transitions: Howl[] = this.props.transitions.map((voice: VoiceLineRender) => new SongHowl(voice));

		transitions.forEach((trans, i) => {
			trans.on("end", () => trans.stop());
			trans.on("load", () => {
				this.loadedTransitionCallback(i, transitions);
				if(i === transitions.length - 1){
					successResponseHandler(this)(`Loaded ${transitions.length} voice lines`);
				}
				this.updateVolume();
			});
		});
		if(transitions.length){
			transitions[this.state.index || 0].load();
		}


		this.setState({
			transitions : [...this.state.transitions.slice(0, this.state.index || 0), ...transitions.slice(this.state.index || 0)],
		});
	}

	updateVolume(){
		if(this.state.playerInitialized){
			this.player.volume(this.state.volume > 0.05 ? Math.min(0.99,(this.state.volume / 100) + 0.1) : 0.01);
		}
	}

	componentDidUpdate(prevProps: IProps, prevState: IState){
		if(prevProps.songs !== this.props.songs){
			this.initializeSongs();
		}
		if(prevProps.transitions !== this.props.transitions){
			this.initializeTransitions();
		}
		if(iOS()){
			this.unlockMobileAudio();
		}
		else if(!this.state.unlocked){
			this.setState({unlocked:true});
		}
		if(prevState.volume !== this.state.volume){
			this.updateVolume();
		}
		if(prevState.ready !== this.state.ready && this.state.ready){
			$("body").css("cursor","inherit");
		}
	}

	componentDidMount(){
		$("body").css("cursor","wait");
		axios.get("../auth").then(data => {
			if(data.data?.users?.length){
				if(data.data.users[0].musicKitToken){
					this.player = musicKitPlayer;
				}
				if(data.data.users[0].spotifyRefreshToken && !iOS()){
					this.player = spotifyPlayer;
				}
			}
			this.player.initialize().then(() => {
				this.setState({
					playerInitialized: true
				});
				this.initializeSongs();
				this.initializeTransitions();
				if(iOS()){
					this.unlockMobileAudio();
				}
				else if(!this.state.unlocked){
					this.setState({unlocked:true});
				}
			});
			setInterval(this.updateProgress, 1000);
			this.player.on("end", () => this.transitionSong(1));
			this.player.on("error", err => errorResponseHandler(this)(String(err)));
		}).catch(axiosErrorResponseHandler(this));
	}

	playSong(index: number = this.state.index){
		this.player.setSong(this.props.songs[index]).then(() => {
			return this.player.play();
		}).catch(errorResponseHandler(this));

		if(index + (bufferSize - 1) > this.props.songs.length){
			this.props.requestMoreSongs(bufferSize);
		}
	}

	pauseSong(){
		this.player.pause().catch(errorResponseHandler(this));
	}

	transitionSong(direction: number = 1){
		this.setState({seekLock: true});
		setTimeout(() => this.setState({seekLock: false}), 150);

		if(
			this.state.index + direction < this.props.songs.length &&
			this.state.index + direction < this.state.transitions.length &&
			this.state.index + direction >= 0){

			//Reset current audio
			this.player.pause().catch(errorResponseHandler(this));
			this.state.transitions[this.state.lastTransition].stop();

			//Play transition audio
			if(!this.state.paused){
				if(this.state.index + direction >= 0){
					this.state.transitions[this.state.index + direction].play();
					this.setState({
						lastTransition : this.state.index + direction
					});
				}

				//Using the enum completely breaks webpack 5
				if(this.props.transitions[this.state.index + direction].type === "PARALLEL"){//VoiceLineType.parallel){
					this.playSong(this.state.index + direction);
				}
				else{
					const indexCache = this.state.index + direction;
					this.state.transitions[this.state.index + direction].on("end",
						() => this.playSong(indexCache)
					);
				}
			}

			this.setState({
				index: this.state.index + direction,
				maxProgress: this.props.songs[this.state.index + direction].duration
			});
		}
		else{
			this.props.requestMoreSongs(bufferSize);
			errorResponseHandler(this)(`Loading more songs...`);
		}
	}

	rewind(){
		if(this.state.progress > 3000 || this.state.index === 0){
			this.setProgress(0);
		}
		else{
			this.transitionSong(-1);
		}
	}

	setVolume(value: number){
		this.setState({
			volume: value
		});
	}

	setProgress(value: number){
		if(this.state.index < this.props.songs.length && !this.state.seekLock && this.state.playerInitialized){
			this.player.seek(value).then(this.updateProgress).catch(errorResponseHandler(this));
		}
	}

	togglePause(){
		if(this.props.songs[this.state.index]){
			if(!this.state.playedIntro){
				this.state.transitions[0].play();
				this.state.transitions[0].on("end", () => {
					this.playSong(0);
				});
				this.setState({
					playedIntro: true
				});
			}
			else{

				if(this.state.transitions[this.state.index].playing()){
					this.state.transitions[this.state.index][this.state.paused ? "play" : "pause"]();
				}
				if(!this.state.paused){
					this.pauseSong();
				}
				else{
					this.playSong();
				}
			}
		}
		this.setState({paused: !this.state.paused});
	}

	changeVoice(event: React.ChangeEvent<HTMLSelectElement>){
		const voice = event.target.value;

		this.setState({
			voice: voice
		});

		jscookie.set("voice", voice);
		this.props.updateVoice(voice, $('.Player select option:selected').text());
	}

	render(){
		return <>
			<IconContext.Provider value={{
				size: "50",
				className: "react-icon"
			}}>
				<div className="Player">
					<img src={this.props.songs[this.state.index]?.thumbnailUrl} />
					<div className="text-gcs-alpine">
						<h2>{this.props.songs[this.state.index]?.title}</h2>
						<h4>{this.props.songs[this.state.index]?.artist}</h4>
					</div>
					<div>
						<button className="btn btn-lg btn-gcs-alpine" onClick={() => {
							window.location.href = `../build?${window.location.href.split("?")[1]}`;
						}}>Edit</button>
						<button disabled={!this.state.ready || !this.state.unlocked || !this.state.playerInitialized } onClick={this.rewind}><FaStepBackward /></button>
						<button disabled={!this.state.ready|| !this.state.unlocked || !this.state.playerInitialized } onClick={this.togglePause}>{
							this.state.paused ? <FaRegPlayCircle /> : <FaRegPauseCircle />
						}</button>
						<button disabled={!this.state.ready|| !this.state.unlocked || !this.state.playerInitialized } onClick={() => this.transitionSong(1)}><FaStepForward /></button>
						<select
							className="form-select form-control btn btn-lg btn-gcs-alpine"
							value={this.state.voice}
							onChange={this.changeVoice}>
							<option value="en-US-Wavenet-B">🇨🇦 Hank Stewart</option>
							<option value="en-US-Wavenet-D">🇨🇦 Carswell Cooper</option>
							<option value="en-IN-Wavenet-C">🇮🇳 Sukhdeep Kaur</option>
							<option value="en-AU-Wavenet-B">🇦🇺 Oscar Hicks</option>
							<option value="en-AU-Wavenet-C">🇦🇺 Shelley Steele</option>
							<option value="en-GB-Wavenet-F">🇬🇧 Courtney Howe</option>
							<option value="en-GB-Wavenet-B">🇬🇧 Ned Burns</option>
							<option value="en-GB-Wavenet-D">🇬🇧 Barry Reynolds</option>
							<option value="de-DE-Wavenet-B">🇩🇪 Nikolaus Fuller</option>
							<option value="fr-FR-Wavenet-A">🇫🇷 Mariele Martin</option>
							<option value="it-IT-Wavenet-D">🇮🇹 Vittorio Gallo</option>
							<option value="ja-JP-Wavenet-D">🇯🇵 Yūto Ryota</option>
							<option value="nb-NO-Wavenet-C">🇳🇴 Nora Hansen</option>
							<option value="pt-PT-Wavenet-B">🇧🇷 João Santos</option>
							<option value="sv-SE-Wavenet-A">🇸🇪 Freja Andersson</option>
							<option value="cmn-CN-Wavenet-A">🇨🇳 Hua Li</option>
						</select>

					</div>
					<Slider
						min={0}
						max={this.state.maxProgress}
						handleStyle={{
							display: "none"
						}}
						className="songProgressBar"
						value={this.state.progress}
						onChange={this.setProgress}
					/>
					<Slider
						min={0}
						max={100}
						handleStyle={{
							display: "none"
						}}
						className="volumeBar mt-md-0 mt-2"
						value={this.state.volume}
						onChange={this.setVolume}
					/>
				</div>
			</IconContext.Provider>
			<Response response={this.state} />
		</>
	}
}
