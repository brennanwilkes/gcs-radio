import * as React from "react";
import "./login.css";
import axios from "axios";
import FloatingLabel from "react-bootstrap-floating-label";
import jscookie from "js-cookie";
import Response, {HasResponse, axiosErrorResponseHandler, errorResponseHandler} from "../Response/Response";
import Navbar from "../Navbar/Navbar";
import HrWrapper from "../HrWrapper/HrWrapper";

interface IProps {
	signup: boolean
}
interface IState extends HasResponse{
	processing: boolean
}

export default class Landing extends React.Component<IProps, IState> {

	static defaultProps = {
		signup: false
	};

	constructor(props: IProps) {
		super(props);
		this.login = this.login.bind(this);

		this.state = {
			processing: false
		}
	}

	componentDidMount(){
		axios.get("/auth", {withCredentials: true}).then(() => {
			window.location.pathname = "../dashboard";
		}).catch(() => {
			jscookie.remove("jwt");
		});
	}

	login(_event: React.FormEvent){

		const email = String($("#email > input").val());
		const password = String($("#password1 > input").val());
		const password2 = String($("#password2 > input").val());

		if(this.props.signup && (password !== password2)){
			errorResponseHandler(this)("Passwords do not match");
		}
		else{
			this.setState({
				processing: true
			});

			axios.post(`../auth${!this.props.signup ? "/login" : ""}`,{
				email,
				password,
				password2
			}).then(() => {
				window.location.pathname = "../dashboard";
			}).catch(axiosErrorResponseHandler(this)).finally(() => {
				this.setState({
					processing: false
				})
			});
		}
	}

	render(){
		return <>
			<Navbar />
			<div className="Login container-lg mt-md-5" onKeyDown={(event) => {
				if (event.key === 'Enter') {
					this.login(event);
				}
			}}>

				<HrWrapper style={{
					borderBottomColor: "var(--gcs-faded)"
				}} children={
					<h2 className="text-gcs-faded" >Login with socials</h2>
				} />

				<a href="../auth/google" className="col-12 col-md-5 btn btn-lg mt-3 mb-2 mb-md-4 mr-md-4 btn-info">
					GOOGLE
				</a>
				<a href="../auth/spotify" className="col-12 col-md-5 btn btn-lg mt-md-3 mb-4 ml-md-4 btn-success">
					SPOTIFY
				</a>

				<HrWrapper style={{
					borderBottomColor: "var(--gcs-faded)"
				}} children={
					<h2 className="text-gcs-faded" >{`${this.props.signup ? "Signup" : "Login"} with email`}</h2>
				} />

				<FloatingLabel
					className="col-12 mb-2 mt-3 px-0"
					id="email"
					label="Email"
					inputClassName="bg-gcs-elevated text-gcs-alpine"
					labelClassName="text-gcs-alpine"
					inputStyle={{
						border: "none"
					}}
				/>
				<div className="row col-12 mx-0 px-0">
				<div className={`col-xs-12 mb-2 px-0 ${this.props.signup ? "col-md-6 pr-md-1" : "col-md-12" }`}>
					<FloatingLabel
						className="w-100"
						id="password1"
						label="Password"
						type="password"
						inputClassName="bg-gcs-elevated text-gcs-alpine"
						labelClassName="text-gcs-alpine"
						inputStyle={{
							border: "none"
						}}
					/>
					</div>
					{
						this.props.signup ? <div
							className="col-xs-12 col-md-6 mb-2 px-0 pl-md-1"
						><FloatingLabel
							className="w-100"
							id="password2"
							label="Confirm password"
							type="password"
							inputClassName="bg-gcs-elevated text-gcs-alpine"
							labelClassName="text-gcs-alpine"
							inputStyle={{
								border: "none"
							}}
						/></div> : <></>
					}
				</div>

				<button
					onClick={this.login}
					className={`col-12 mb-1 btn btn-${this.state.processing ? "warning" : "primary"}`}>{
					this.state.processing
					? `Processing`
					: `${this.props.signup ? "Sign Up" : "Login"}`
				}</button>

				<a href={this.props.signup ? "../login" : "../login?signup=1"} className="text-secondary">
					{!this.props.signup ? "No account? Sign up" : "Have an account? Login"}
				</a>

			</div>
			<Response response={this.state} lifetime={3000} />
		</>
	}
}
