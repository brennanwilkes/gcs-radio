import * as React from "react";
import axios from "axios";
import {Playlist} from "../../types/playlist";
import {User} from "../../types/user";
import jscookie from "js-cookie";
import Response, {HasResponse, axiosErrorResponseHandler, successResponseHandler} from "../Response/Response";
import NavBar from "../Navbar/Navbar";
import HrWrapper from "../HrWrapper/HrWrapper";
import PlaylistView from "../PlaylistView/PlaylistView";

import "./dashboard.css";

interface IProps {}
interface IState extends HasResponse{
	playlists: Playlist[],
	user?: User
}

export default class Dashboard extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props);
		this.deletePlaylist = this.deletePlaylist.bind(this);

		this.state = {
			playlists: []
		}
	}

	deletePlaylist(playlist: Playlist, i: number){
		axios.delete(`../api/v1/playlists/${playlist.id}`).then(() => {
			this.setState({
				playlists: this.state.playlists.filter((_p:Playlist, ii: number) => i !== ii)
			});
			successResponseHandler(this)(`Deleted ${playlist.details?.name ?? playlist.id}`);
		}).catch(axiosErrorResponseHandler);
	}

	componentDidMount(){
		axios.get("/auth").then(resp => {
			this.setState({
				user: resp.data.users[0]
			});

			axios.get("/api/v1/playlists?noRender=1").then(resp2 => {
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

		const connected = !!this.state.user?.refreshToken;

		return <>
			<NavBar />
			<div className="Dashboard container-lg mt-md-5">

				<button
					disabled={connected}
					className={`col-12 col-md-5 mr-md-4 mb-2 mb-md-4 btn btn-lg btn-${connected ? "gcs-elevated" : "gcs-faded" }`}
					onClick={() => {
						window.location.href = "../auth/spotify";
					}}
				>{
					connected ? "Spotify Connected" : "Connect To Spotify"
				}</button>

				<button
					className="col-12 col-md-5 ml-md-4 mb-2 mb-md-4 btn btn-lg btn-gcs-bright"
					onClick={() => {
						window.location.href = "../builder";
					}}
				>
					Create New Playlist
				</button>

				<HrWrapper style={{
					borderBottomColor: "var(--gcs-faded)"
				}} children={
					<h2 className="text-gcs-faded" >Your Playlists</h2>
				} />
				{
					this.state.playlists.map((playlist, i) => <PlaylistView
						first={i===0}
						key={`${playlist.id}-${i}`}
						playlist={playlist}
						keyExtension={i}
						deleteCallback={this.deletePlaylist}
					/>)
				}
			</div>
			<Response response={this.state} />
		</>
	}
}
