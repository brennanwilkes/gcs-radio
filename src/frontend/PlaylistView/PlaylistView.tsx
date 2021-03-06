import axios from "axios";

import {Playlist} from '../../types/playlist';
import {Song} from '../../types/song';
import arrayShuffle from "array-shuffle";
import {WrappedSongPolaroid} from "../SongPolaroid/SongPolaroid";
import "./playlistView.scss";

import {useTranslation} from "react-i18next";



const Play = () => <>{useTranslation("common").t("playlist.play")}</>
const Edit = () => <>{useTranslation("common").t("playlist.edit")}</>
const Delete = () => <>{useTranslation("common").t("playlist.delete")}</>

interface IProps {
	playlist: Playlist,
	keyExtension: number,
	className?: string
	first?: boolean,
	last?: boolean,
	deleteCallback?: (playlist: Playlist, i: number) => void
}
interface IState {
	features: Song[]
}


export default class PlaylistView extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props);
		this.state = {
			features: []
		};
	}

	componentDidMount(){
		this.setState({
			features: arrayShuffle(this.props.playlist.details?.features ?? [])
		});
		if(this.props.last){
			$("body").css("cursor","inherit");
		}
	}

	render(){
		const playlist = this.props.playlist;
		const ext = this.props.keyExtension;

		console.dir('-');
		console.dir(this.state);
		console.dir('-');

		return <>
			<div
				key={`${playlist.id}${ext}`}
				className={`${this.props.className ?? ""} PlaylistView mx-0 container-lg row ${ !this.props.first ? "my-BIG" : "mb-BIG mt-4"} pl-md-5`}
			>
				<div className="featureDisplay px-0 px-0 col-12 col-md-3 col-xl-4 mx-0"><div className="container-fluid row">{
					this.state.features.map((song, i) => <WrappedSongPolaroid
						key={`${playlist.id}${song.id}-${ext}`}
						className="col-12 mb-0"
						song={song}
						cutoff={screen.width > 1200 ? 24 : 12}
						keyExtension={`${playlist.id}${ext}-${i}`} />)
				}</div></div>
				<div className={`playlistDetails px-0 px-0 col-12 col-md-9 col-xl-8 ${this.state.features.length > 1 ? "pl-md-BIG" : ""}`}>
					<h2 className="text-gcs-alpine">{playlist.details?.name}</h2>
					<h4 className="text-gcs-faded">{playlist.details?.description}</h4>
					<div className="playlistControls mt-3">
						<a
							className="btn btn-lg btn-gcs-faded px-4"
							href={`../app?playlist=${encodeURIComponent(playlist.id as string)}`}>
							<Play />
						</a>
						<a className="btn btn-lg btn-gcs-bright px-4" href={`../build?playlist=${encodeURIComponent(playlist.id as string)}`}><Edit /></a>
						{
							this.props.deleteCallback ? <button className="btn btn-lg btn-gcs-loud px-4" onClick={() => {
								if(this.props.deleteCallback){
									this.props.deleteCallback(playlist, this.props.keyExtension);
								}
							}}><Delete /></button> : <></>
						}

					</div>
				</div>
			</div>
		</>
	}
}
