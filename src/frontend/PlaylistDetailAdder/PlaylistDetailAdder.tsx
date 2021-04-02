import * as React from "react";
import axios from "axios";
import {Song} from '../../types/song';
import {FaAngleDoubleDown} from "react-icons/fa";

import FloatingLabel from "react-bootstrap-floating-label";
import HrWrapper from "../HrWrapper/HrWrapper";
import ReactBootstrapCheckbox from "../ReactBootstrapCheckbox/ReactBootstrapCheckbox";
import {WrappedSongPolaroid} from "../SongPolaroid/SongPolaroid";
import {getSongKey} from "../SongRow/SongRow";
import "./playlistDetailAdder.css";
import {useTranslation} from "react-i18next";
import {i18nInitialized, i18next} from "../Translator";

const Usage1 = () => <>{useTranslation("common").t("detailAdder.usage2")}</>
const Usage2 = () => <>{useTranslation("common").t("detailAdder.usage2")}</>
const DetailsHeader = () => <>{useTranslation("common").t("detailAdder.details")}</>
const Featured = () => <>{useTranslation("common").t("detailAdder.featured")}</>

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
	selected: string[],
	nameTranslation: string,
	descTranslation: string
}

type NewType = Omit<IState, "selected" | "nameTranslation" | "descTranslation">;

type noSelect = NewType
interface Details extends noSelect{
	selected?: string[]
}
export { Details };
export default class PlaylistDetailAdder extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props);

		i18nInitialized.then((t) => {
			i18next.loadNamespaces(["translations","common","en","common_en"], () => {
				this.setState({
					nameTranslation: t("common:detailAdder.name"),
					descTranslation: t("common:detailAdder.description"),
				});

			});
		}).catch(console.error);

		this.state = {
			private: true,
			selected: [],
			nameTranslation: "",
			descTranslation: ""
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

	render(){


		return <>
			<div className="DetailAdder container-lg">

				{
					!this.props.initialName ? <p className="text-gcs-alpine">
						<Usage1 />
						<br />
						<Usage2 />
					</p> : <></>
				}

				<HrWrapper style={{
					borderBottomColor: "var(--gcs-faded)"
				}} children={
					<h2 className="text-gcs-faded" ><DetailsHeader /></h2>
				} />

				<div className="nameCheckWrapper">
					<FloatingLabel
						initialValue={this.props.initialName}
						label={this.state.nameTranslation}
						inputClassName="bg-gcs-elevated text-gcs-alpine"
						labelClassName="text-gcs-alpine"
						inputStyle={{
							border: "none"
						}}
						onChange={(event) => this.setState({name: (event.target as HTMLTextAreaElement).value})}
						onChangeDelay={150} />
					<ReactBootstrapCheckbox
						default={!(this.props.initialPrivate ?? true)}
						label={this.state.private ? useTranslation("common").t("detailAdder.private") : useTranslation("common").t("detailAdder.public") }
						colour={this.state.private ? "danger" : "success"}
						onChange={(checked) => this.setState({private: !checked})} />
				</div>
				<FloatingLabel
					initialValue={this.props.initialDescription}
					label={this.state.descTranslation}
					inputClassName="bg-gcs-elevated text-gcs-alpine"
					labelClassName="text-gcs-alpine"
					inputStyle={{
						border: "none"
					}}
					onChange={(event) => this.setState({description: (event.target as HTMLTextAreaElement).value})}
					onChangeDelay={150} />

				<HrWrapper style={{
					borderBottomColor: "var(--gcs-faded)"
				}} children={
					<span style={{display:"inline-flex"}}><h2 className="text-gcs-faded"><Featured /></h2><button className="ml-2 btn btn-outline-gcs-loud" onClick={() => {
						$("html, body").animate({ scrollTop: $(document).height() }, "slow");
					}}><FaAngleDoubleDown /></button></span>
				} />


				<div className="songsDisplay container-fluid row mx-0">{
					this.props.songs.map((song, i) => <WrappedSongPolaroid
						key={getSongKey(song, i)}
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
