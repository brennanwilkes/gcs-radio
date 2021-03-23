import * as React from "react";
import StatusIcon, {StatusType} from "./sumi9xmIcon";
import {Error} from "../../types/error";

import "./response.css";

export const errorFromAxios = (possibleErr: any) => { return {
	error: possibleErr.response?.data?.errors[0]?.error ?? "Unknown Error",
	path: possibleErr.response?.data?.errors[0]?.path ?? "Unknown Path",
	message: possibleErr.response?.data?.errors[0]?.message ?? "An error occurred",
	status: possibleErr.response?.data?.errors[0]?.status ?? 500,
}}

export interface ResponseData {
	type: StatusType,
	message: string,
}
export type ResponseBody = Error | ResponseData
export {StatusType}

interface IProps {
	response?: ResponseBody,
	lifetime?: number,
	fadeTime?: number
}
interface IState {
	timeout?: number,
	type: StatusType
	message: string
	id: string,
	animation: (() => void)[]
}

const defaultFadeTime = 250;
export default class Response extends React.Component<IProps, IState> {

	constructor(props: IProps){
		super(props);

		this.loadResponse = this.loadResponse.bind(this);
		this.promisizeAnim = this.promisizeAnim.bind(this);
		this.loadIn = this.loadIn.bind(this);
		this.loadOut = this.loadOut.bind(this);
		this.queueAnim = this.queueAnim.bind(this);

		this.state = {
			type: StatusType.SUCCESS,
			message: "",
			id: `Response-${Math.round(Math.random()*100000)}`,
			animation: []
		}
	}

	loadResponse(resp: ResponseData){
		this.loadIn(resp);
		if(this.props.lifetime){
			this.loadOut(this.props.lifetime);
		}
	}

	promisizeAnim(callback: () => void, timeToComplete: number){
		return () => {
			callback();
			setTimeout(() => {
				let animToPlay: (() => void) | undefined;
				this.setState((prevState: IState) => {
					if(prevState.animation.length > 1){
						animToPlay = prevState.animation[1];
					}
					return {
						animation: prevState.animation.slice(1)
					}
				}, () => {
					if(animToPlay){
						animToPlay();
					}
				});
			}, timeToComplete);
		}
	}

	queueAnim(callback: () => void, timeToComplete: number){
		const anim = this.promisizeAnim(callback, timeToComplete);

		let isFirst = false
		this.setState((prevState: IState) => {
			isFirst = prevState.animation.length === 0;
			return {
				animation: [...prevState.animation, anim]
			};
		},() => {
			if(isFirst){
				anim();
			}
		});
	}

	loadOut(delay: number = 0){
		this.queueAnim(() => {
			setTimeout(() => {
				$(`#${this.state.id}`).slideUp().delay(50).fadeOut();
			}, delay)
		}, this.props.fadeTime ?? defaultFadeTime + 50 + delay);
	}


	loadIn(resp: ResponseData){
		this.queueAnim(() => {
			this.setState(resp);
			$(`#${this.state.id}`).fadeIn(this.props.fadeTime ?? defaultFadeTime);
		}, this.props.fadeTime ?? defaultFadeTime);
	}

	componentDidMount(){
		$(`#${this.state.id}`).hide();
	}

	componentDidUpdate(prevProps: IProps){
		if(this.props.response){
			if(prevProps.response !== this.props.response){
				this.loadResponse("type" in this.props.response ? {
					type: this.props.response.type,
					message: this.props.response.message
				}: {
					type: (this.props.response.status ?? 500) > 299 ? StatusType.FAILURE : StatusType.SUCCESS,
					message: this.props.response.message ?? this.props.response.error
				});
			}
		}
	}

	render(){
		return <>
			<div
				id={this.state.id}
				className={`Response m-6 Response${this.state.type === StatusType.FAILURE ? "Failure" : "Success"}`}
			>
				<div className="p-1">
					<StatusIcon type={this.state.type} scale={0.35} />
					<h6 className="m-0 pr-4">{
						this.state.message
					}</h6>
				</div>
			</div>
		</>
	}
}
