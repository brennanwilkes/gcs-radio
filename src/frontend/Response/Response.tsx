import StatusIcon, {StatusType} from "./sumi9xmIcon";
import {Error} from "../../types/error";

import "./response.css";


export const errorFromAxios = (possibleErr: any) => {
	return {
		error: possibleErr.response?.data?.errors[0]?.error ?? "Unknown Error",
		path: possibleErr.response?.data?.errors[0]?.path ?? "Unknown Path",
		message: possibleErr.response?.data?.errors[0]?.message ?? "An error occurred",
		status: possibleErr.response?.data?.errors[0]?.status ?? 500,
	}
}

export interface HasResponse{
	response?: ResponseBody
}

const getResponse = (data: HasResponse | ResponseBody): ResponseBody => (("response" in data) ? data.response : data) as ResponseBody;
function isResponseBody(data: any): data is ResponseBody | Error{
	return ("type" in data && "message" in data) || ("error" in data && "path" in data);
}

export interface ResponseData {
	type: StatusType,
	message: string,
}
export type ResponseBody = Error | ResponseData
export {StatusType}

interface IProps {
	response?: ResponseBody | HasResponse,
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
const defaultLifeTime = 750;
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
		this.loadOut(this.props.lifetime ?? defaultLifeTime);
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

		if(this.props.response && isResponseBody(getResponse(this.props.response))){

			if(prevProps.response !== this.props.response && (!prevProps.response || (getResponse(prevProps.response) !== getResponse(this.props.response)))){

				const response = getResponse(this.props.response);

				this.loadResponse("type" in response ? {
					type: response.type,
					message: response.message
				}: {
					type: (response.status ?? 500) > 299 ? StatusType.FAILURE : StatusType.SUCCESS,
					message: response.message ?? response.error
				});
			}
		}
	}

	render(){
		return <>
			<div
				tabIndex={-1}
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

export const axiosErrorResponseHandler = (component: React.Component) => (resp: any) => {
	component.setState({
		response: errorFromAxios(resp)
	})
}

export const errorResponseHandler = (component: React.Component) => (message: string) => {
	component.setState({
		response: {
			type: StatusType.FAILURE,
			message: message
		}
	});
}

export const successResponseHandler = (component: React.Component) => (message: string) => {
	component.setState({
		response: {
			type: StatusType.SUCCESS,
			message: message
		}
	});
}
