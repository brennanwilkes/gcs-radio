import * as React from "react";
import {Song} from '../../types/song';
import SongHowl, { iOS } from '../../types/songHowl';
import { FaRegPlayCircle, FaRegPauseCircle, FaStepForward, FaStepBackward } from 'react-icons/fa';
import {IconContext} from "react-icons";
import "./player.css";
import { VoiceLineRender } from "../../types/voiceLine";
import {Howl} from "howler";

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import {spotifyPause, spotifyPlayId, spotifySeek} from "../spotifyWebSDK/spotify";
import { access_token } from "../spotifyWebSDK/spotifyWebSDK";

interface IProps {
	songs: Song[],
	transitions: VoiceLineRender[],
	spotifySDKMode?: boolean
}
interface IState {
	paused: boolean,
	queue: Howl[],
	transitions: Howl[],
	progress: number,
	maxProgress: number,
	index: number,
	ready: boolean,
	unlocked: boolean,
	seekLock: boolean,
	lastTransition: number,
	playedIntro: boolean,
	spotifySDKMode: boolean
}

export default class App extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.togglePause = this.togglePause.bind(this);
		this.transitionSong = this.transitionSong.bind(this);
		this.updateProgress = this.updateProgress.bind(this);
		this.setProgress = this.setProgress.bind(this);
		this.rewind = this.rewind.bind(this);
		this.initializeSongs = this.initializeSongs.bind(this);
		this.initializeTransitions = this.initializeTransitions.bind(this);
		this.loadedSongCallback = this.loadedSongCallback.bind(this);
		this.loadedTransitionCallback = this.loadedTransitionCallback.bind(this);
		this.unlockMobileAudio = this.unlockMobileAudio.bind(this);
		this.playSong = this.playSong.bind(this);
		this.pauseSong = this.pauseSong.bind(this);
		this.getProgress = this.getProgress.bind(this);

		this.state = {
			queue: [],
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
			spotifySDKMode: this.props.spotifySDKMode ?? access_token !== "INVALID"
		};

		setInterval(this.updateProgress, 1000);
	}

	updateProgress(){
		if(this.state.index < this.state.queue.length){
			this.setState({
				progress: this.getProgress()
			});
		}
	}

	loadedSongCallback(i: number, queue: Howl[]){
		if(i === 0){
			this.setState({
				ready: true,
				maxProgress: queue[0].duration()
			});
		}
		if(i + 1 < queue.length){
			console.log(`Loading song ${i + 1}/${queue.length - 1}`);
			queue[i + 1].load();
		}
	}

	initializeSongs(){
		const queue: Howl[] = this.props.songs.map((song: Song) => new SongHowl(song));

		queue.forEach((audio,i) => {
			audio.on("end", () => this.transitionSong(1));
			audio.on("load", () => this.loadedSongCallback(i, queue));
		});
		queue[0].load();

		this.setState({
			queue : queue,
		});
	}

	unlockMobileAudio(){
		document.body.addEventListener('touchstart', () => {
			if(!this.state.unlocked){
				alert("unlock");
				this.state.queue.forEach(audio => {
					audio.play();
					audio.pause();
					audio.seek(0);
				});
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
			console.log(`Loading transition ${i + 1}/${transitions.length - 1}`);
			transitions[i + 1].load();
		}
	}

	initializeTransitions(){
		const transitions: Howl[] = this.props.transitions.map((voice: VoiceLineRender) => new SongHowl(voice));

		transitions.forEach((trans, i) => {
			trans.on("end", () => trans.stop());
			trans.on("load", () => this.loadedTransitionCallback(i, transitions));
		});
		transitions[0].load();

		this.setState({
			transitions : transitions,
		});
	}

	componentDidUpdate(prevProps: IProps){
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
	}

	componentDidMount(){

		this.initializeSongs();
		this.initializeTransitions();
		if(iOS()){
			this.unlockMobileAudio();
		}
		else if(!this.state.unlocked){
			this.setState({unlocked:true});
		}
	}

	playSong(index: number){
		if(this.state.spotifySDKMode){
			spotifyPlayId(this.props.songs[index].spotifyId);
		}
		else{
			this.state.queue[index].play();
		}
	}

	pauseSong(index: number){
		if(this.state.spotifySDKMode){
			spotifyPause();
		}
		else{
			this.state.queue[index].pause();
		}
	}

	getProgress(): number{
		if(this.state.spotifySDKMode){
			return spotifySeek();
		}
		else{
			return this.state.queue[this.state.index].seek() as number;
		}
	}

	transitionSong(direction: number = 1){

		this.setState({seekLock: true});
		setTimeout(() => this.setState({seekLock: false}), 150);

		if(
			this.state.index + direction < this.state.queue.length &&
			this.state.index + direction < this.state.transitions.length &&
			this.state.index + direction >= 0){

			//Reset current audio
			this.state.queue[this.state.index].stop();
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
			console.error("Can't transition to song!!");
			this.togglePause();
		}
	}

	rewind(){
		if(this.state.progress > 3 || this.state.index === 0){
			this.setProgress(0);
		}
		else{
			this.transitionSong(-1);
		}
	}

	setProgress(value: number){
		if(this.state.index < this.state.queue.length && !this.state.seekLock){
			if(this.state.spotifySDKMode){
				spotifySeek(value);
			}
			else{
				this.state.queue[this.state.index].seek(value);
			}
			this.updateProgress();
		}
	}

	togglePause(){
		if(this.state.queue[this.state.index]){
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
				if(this.state.paused){
					this.pauseSong(this.state.index);
				}
				else{
					this.playSong(this.state.index);
				}
			}
		}
		this.setState({paused: !this.state.paused});
	}

	render(){
		return <>
			<IconContext.Provider value={{
				size: "50",
				className: "react-icon"
			}}>
				<div className="Player">
					<img src={this.props.songs[this.state.index]?.thumbnailUrl} />
					<div>
						<h2>{this.props.songs[this.state.index]?.title}</h2>
						<h4>{this.props.songs[this.state.index]?.artist}</h4>
					</div>
					<div>
						<button disabled={!this.state.ready || !this.state.unlocked} onClick={this.rewind}><FaStepBackward /></button>
						<button disabled={!this.state.ready|| !this.state.unlocked} onClick={this.togglePause}>{
							this.state.paused ? <FaRegPlayCircle /> : <FaRegPauseCircle />
						}</button>
						<button disabled={!this.state.ready|| !this.state.unlocked} onClick={() => this.transitionSong(1)}><FaStepForward /></button>
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
				</div>
			</IconContext.Provider>
		</>
	}
}
