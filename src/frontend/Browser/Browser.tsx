import * as React from "react";
import axios from "axios";
import "./browser.css";

import Navbar from "../Navbar/Navbar";
import { Playlist } from "../../types/playlist";
import PlaylistView from "../PlaylistView/PlaylistView";

interface IProps {}
interface IState {
	playlists: Playlist[],
}

export default class Browser extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);

		this.state = {
			playlists: []
		}
	}

	componentDidMount(){
		axios.get("/api/v1/playlists?isNamed=1&noRender=1").then(resp => {
			this.setState({
				playlists: resp.data.playlists.filter((p:Playlist) => !!p.details)
			});
		}).catch(console.error);
	}


	render(){
		return <>
            <Navbar />
			<div className="Browser container-lg mt-md-5">
				{
					this.state.playlists.map((playlist, i) => <PlaylistView
						first={i===0}
						key={`${playlist.id}-${i}`}
						playlist={playlist}
						keyExtension={i}
					/>)
				}
			</div>
		</>
	}
}
