import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';

import FloatingLabel from "react-bootstrap-floating-label";
import HrWrapper from "../HrWrapper/HrWrapper";
import ReactBootstrapCheckbox from "../ReactBootstrapCheckbox/ReactBootstrapCheckbox";
import {WrappedSongPolaroid} from "../SongPolaroid/SongPolaroid";
import {getSongKey} from "../SongRow/SongRow";
import "./playlistDetailAdder.css";

interface IProps {
	detailCallback: ((details: IState) => void),
	initialName?: string,
	initialDescription?: string,
	initialPrivate?: boolean,
	songs: Song[]
}
interface IState {
	name?: string
	description?: string,
	private?: boolean,
	selected: string[]
}

type noSelect = Omit<IState, "selected">
interface Details extends noSelect{
	selected?: string[]
}
export { Details };
export default class PlaylistDetailAdder extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props);

		this.state = {
			private: true,
			selected: []
		}
	}

	componentDidUpdate(_prevProps: IProps, prevState: IState){
		if(prevState !== this.state){
			this.props.detailCallback(this.state);
		}
	}

	componentDidMount(){
		this.setState({
			name: this.props.initialName,
			description: this.props.initialDescription,
			private: this.props.initialPrivate ?? true
		});
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


	render(){


		return <>
			<div className="DetailAdder container-lg">

				{
					!this.props.initialName ? <p>
						Add an optional title to your playlist to save it to your profile! <br />
						Additionally, you may add an optional description, privacy setting, and up to three featured songs!
					</p> : <></>
				}


				<HrWrapper style={{
					borderBottomColor: "#CCC"
				}} children={
					<h2>Details</h2>
				} />
				<div className="nameCheckWrapper">
					<FloatingLabel
						initialValue={this.props.initialName}
						label="Name"
						onChange={(event) => this.setState({name: (event.target as HTMLTextAreaElement).value})}
						onChangeDelay={150} />
					<ReactBootstrapCheckbox
						default={!(this.props.initialPrivate ?? true)}
						label={this.state.private ? "PRIVATE" : "PUBLIC "}
						colour={this.state.private ? "danger" : "success"}
						onChange={(checked) => this.setState({private: !checked})} />
				</div>
				<FloatingLabel
					initialValue={this.props.initialDescription}
					label="Description"
					onChange={(event) => this.setState({description: (event.target as HTMLTextAreaElement).value})}
					onChangeDelay={150} />

				<HrWrapper style={{
					borderBottomColor: "#CCC"
				}} children={
					<h2>Featured Songs</h2>
				} />

				<div className="songsDisplay container-fluid row">{
					this.props.songs.map((song) => <WrappedSongPolaroid
						key={getSongKey(song)}
						className="col-xl-3 col-lg-4 col-md-6 col-xs-12 mb-0"
						song={song}
						isHoverable={true}
						isSelectable={true}
						selected={this.state.selected.includes(`${song.spotifyId}:${song.youtubeId}`)}
						onClick={(toSelect: Song) => {
							if(this.state.selected.includes(`${toSelect.spotifyId}:${toSelect.youtubeId}`)){
								this.setState({
									selected: this.state.selected.filter(s => s !== `${toSelect.spotifyId}:${toSelect.youtubeId}`)
								});
							}
							else if(this.state.selected.length < 3){
								this.setState({
									selected: [...this.state.selected, `${toSelect.spotifyId}:${toSelect.youtubeId}`]
								});
							}
						}}
						keyExtension="selected" />)
				}</div>


			</div>
		</>
	}
}
