//https://bootsnipp.com/snippets/2eEjz

import "./sumi9xmIcon.css";

export enum StatusType{
	SUCCESS = "SUCCESS",
	FAILURE = "FAILURE"
}

interface IProps {
	type: StatusType,
	scale?: number,
}
interface IState {}

export default class StatusIcon extends React.Component<IProps, IState> {

	render(){
		return <><div style={{transform: `scale(${this.props.scale ?? 1})`}}>{this.props.type === StatusType.SUCCESS ? <>
			<div className="swal2-icon swal2-success swal2-animate-success-icon" style={{display: "flex"}}>
				<div className="swal2-success-circular-line-left"></div>
				<span className="swal2-success-line-tip"></span>
				<span className="swal2-success-line-long"></span>
				<div className="swal2-success-ring"></div>
				<div className="swal2-success-fix"></div>
				<div className="swal2-success-circular-line-right"></div>
			</div>
		</> : <>
			<div className="swal2-icon swal2-error swal2-animate-error-icon" style={{display: "flex"}}>
				<span className="swal2-x-mark">
					<span className="swal2-x-mark-line-left"></span>
					<span className="swal2-x-mark-line-right"></span>
				</span>
			</div>
		</>
		}</div></>
	}
}
