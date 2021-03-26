import * as React from "react";
import axios from "axios";
import {Playlist} from "../../types/playlist";
import {User} from "../../types/user";
import jscookie from "js-cookie";
import Response, {HasResponse, axiosErrorResponseHandler, successResponseHandler} from "../Response/Response";


import "./dashboard.css";

interface IProps {}
interface IState extends HasResponse{
	playlists: Playlist[],
	user?: User
}

export default class Dashboard extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props);

		this.state = {
			playlists: []
		}
	}

	deletePlaylist(playlist: Playlist, i: number){
		axios.delete(`../api/v1/playlists/${playlist.id}`).then(() => {
			this.setState({
				playlists: this.state.playlists.filter((p:Playlist, ii: number) => i !== ii)
			});
			successResponseHandler(this)(`Deleted ${playlist.details?.name ?? playlist.id}`);
		}).catch(axiosErrorResponseHandler);
	}

	componentDidMount(){
		axios.get("/auth").then(resp => {
			this.setState({
				user: resp.data.users[0]
			});

			axios.get("/api/v1/playlists").then(resp2 => {
				this.setState({
					playlists: resp2.data.playlists.filter((playlist: Playlist) => playlist.details?.user === resp.data.users[0].id )
				});
			}).catch(axiosErrorResponseHandler);
		}).catch(() => {
			jscookie.remove("jwt");
			jscookie.remove("sat");
			jscookie.remove("srt");
			window.location.href = "../login";
		});
	}

	render(){
		return <>
			<h1>{this.state.user?.email}</h1>
			<h3 className={this.state.user?.refreshToken ? "spotifyConnected" : ""}>{
				this.state.user?.refreshToken ? "Spotify Connected" : <a href="../auth/spotify">Connect Spotify</a>
			}</h3>
			<ul>{
				this.state.playlists.map((playlist, i) => (
					<li key={`${playlist.details?.name}-${i}`}>
						{playlist.details?.name}
						<a href={`../app?playlist=${encodeURIComponent(playlist.id as string)}`}>Play</a>
						<a href={`../builder?playlist=${encodeURIComponent(playlist.id as string)}`}>Edit</a>
						<button onClick={() => this.deletePlaylist(playlist, i)} className="btn btn-danger">Delete</button>
						</li>
				))
			}</ul>
			<a href="../builder">Build a playlist</a>
			<Response response={this.state} />
		</>
	}
}
