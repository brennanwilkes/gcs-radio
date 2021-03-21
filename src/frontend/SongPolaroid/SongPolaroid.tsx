import * as React from "react";
import {Song} from '../../types/song';

import "./songPolaroid.css";
import "./responsiveHeaders.css";

interface IProps {
	song: Song,
	keyExtension?: string,
	onClick?: (song: Song) => void,
	isHoverable?: boolean,
	isDeletable?: boolean,
	isSelectable?: boolean,
	selected?: boolean
}
interface IState {
	key: string
}


export default class SongPolaroid extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props);

		this.state = {
			key: this.props.song.id ?? `${this.props.song.spotifyId}:${this.props.song.youtubeId}` + this.props.keyExtension ?? ""
		}
	}
	
	render(){
		return <>
			<div
				className={
					`songPolaroid${this.props.isHoverable ? " songPolaroidHoverable" : ""}${this.props.isDeletable ? " songPolaroidDeletable" : ""}${this.props.isSelectable ? " songPolaroidSelectable" : ""}${this.props.selected ? " songPolaroidSelected" : ""}`
				}
				onClick={() => {
					if(this.props.onClick){
						this.props.onClick(this.props.song);
					}
				}} >
				<div>
					<div>
						<img src={this.props.song.thumbnailUrl}/>
					</div>
					<div className="p-2">
						<h4 className="rh4 m-n1">{this.props.song.title}</h4>
						<h5 className="rh5 m-n1">{this.props.song.artist}</h5>
					</div>
				</div>
			</div>
		</>
	}
}

interface WrappedIProps extends IProps{
	className?: string
}
export class WrappedSongPolaroid extends React.Component<WrappedIProps, {}> {
	render(){
		return <>
			<div className={`p-2 ${this.props.className ?? ""}`}>
				<SongPolaroid
					song={this.props.song}
					keyExtension={this.props.keyExtension}
					onClick={this.props.onClick}
					isHoverable={this.props.isHoverable}
					isDeletable={this.props.isDeletable}
					isSelectable={this.props.isSelectable}
					selected={this.props.selected} />
			</div>
		</>
	}
}
