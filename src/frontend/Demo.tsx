// Brennan Wilkes

// Imports
import * as React from "react";
import axios from "axios";
//import Floatinglabel from "react-bootstrap-floating-label";

/**
 * Main GCS Radio App Component.
 * Renders out main route level sub-components,
 * manages all global state information, and links
 * subcomponents together using callback methods
 * @class
 * @extends React.Component
 */
class App extends React.Component {

	state = {
		search: "",
		download: "",
		download2: "",
		song: "",
		audio: ""
	}

	constructor(props: any){
		super(props);

		this.state = {
			search: "",
			download: "",
			download2: "",
			song: "",
			audio: ""
		}
	}
	/**
	 *
	 */
	render () {
		return <>
			<h2>GCS Radio</h2>

			<form onSubmit={(event) => {
				event.preventDefault();
				if(this.state.search){
					const elem = document.getElementById("res");
					if(elem) elem.innerHTML = "Loading...";
					axios.get(`/api/v1/search?query=${encodeURIComponent(this.state.search)}`).then(res => {
						if(elem) elem.innerHTML = `${JSON.stringify(res.data.songs,null,2)}`;
					}).catch(err => console.error(err));
				}
				else if(this.state.download && this.state.download2){
					const elem = document.getElementById("res");
					if(elem) elem.innerHTML = "Loading...";
					axios.post(`/api/v1/songs?youtubeId=${encodeURIComponent(this.state.download)}&spotifyId=${encodeURIComponent(this.state.download2)}`).then(res => {
						if(elem) elem.innerHTML = `${JSON.stringify(res.data,null,2)}`;
					}).catch(err => console.error(err));
				}
				else if(this.state.song){
					const elem = document.getElementById("res");
					if(elem) elem.innerHTML = "Loading...";
					axios.get(`/api/v1/songs/${encodeURIComponent(this.state.song)}`).then(res => {
						if(elem) elem.innerHTML = `${JSON.stringify(res.data,null,2)}`;
					}).catch(err => console.error(err));
				}
				else if(this.state.audio){
					const elem = document.getElementById("player");
					if(elem){
						elem.setAttribute("src",`/api/v1/audio/${encodeURIComponent(this.state.audio)}`);
						console.log(elem.getAttribute("src"));
					}
				}

				this.setState({
					search: "",
					download: "",
					download2: "",
					song: "",
					audio: ""
				});
			}}>
				<h3>Search: <input id="search" type="text" value={this.state.search} onChange={(e) => this.setState({search:e.target.value})} /></h3><br />
				<h3>Download: <input id="download" type="text" value={this.state.download} onChange={(e) => this.setState({download:e.target.value})} /><input id="download2" type="text" value={this.state.download2} onChange={(e) => this.setState({download2:e.target.value})} /></h3><br />
				<h3>Get Song: <input id="song" type="text" value={this.state.song}  onChange={(e) => this.setState({song:e.target.value})} /></h3><br />
				<h3>Play song: <input id="audio" type="text" value={this.state.audio} onChange={(e) => this.setState({audio:e.target.value})} /></h3><br />

				<input type="submit" value="Submit" />

			</form>
			<pre><code><div id="res"></div></code></pre>
			<audio id="player" controls={true} autoPlay></audio>
		</>;
	}
}
export default App;
