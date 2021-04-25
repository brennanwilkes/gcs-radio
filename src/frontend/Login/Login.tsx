import "./login.css";
import axios from "axios";
import FloatingLabel from "react-bootstrap-floating-label";
import jscookie from "js-cookie";
import Response, {HasResponse, axiosErrorResponseHandler, errorResponseHandler, successResponseHandler} from "../Response/Response";
import Navbar from "../Navbar/Navbar";
import HrWrapper from "../HrWrapper/HrWrapper";
import {FaSpotify, FaGoogle} from "react-icons/fa";
import {useTranslation} from "react-i18next";
import {i18nInitialized, i18next} from "../Translator";

const SocialLogin = () => <>{useTranslation("common").t("login.socialLogin")}</>
const EmailLogin = () => <>{useTranslation("common").t("login.emailLogin")}</>
const EmailSignup = () => <>{useTranslation("common").t("login.emailSignup")}</>
const Google = () => <>{useTranslation("common").t("login.google")}</>
const Spotify = () => <>{useTranslation("common").t("login.spotify")}</>
const LoginHeader = () => <>{useTranslation("common").t("login.login")}</>
const SignUpHeader = () => <>{useTranslation("common").t("login.signup")}</>
const SignupMessage = () => <>{useTranslation("common").t("login.signupMessage")}</>
const LoginMessage = () => <>{useTranslation("common").t("login.loginMessage")}</>
const ThankYou = () => <>{useTranslation("common").t("login.thankyou")}</>
const Verify = () => <>{useTranslation("common").t("login.verify")}</>

interface IProps {
	signup: boolean,
	verified: boolean
}
interface IState extends HasResponse{
	processing: boolean,
	verifyRequest: boolean,
	emailTranslation: string,
	passwordTranslation: string,
	confirmTranslation: string
}

export default class Landing extends React.Component<IProps, IState> {

	static defaultProps = {
		signup: false
	};

	constructor(props: IProps) {
		super(props);
		this.login = this.login.bind(this);

		this.state = {
			processing: false,
			verifyRequest: false,
			emailTranslation: "",
			passwordTranslation: "",
			confirmTranslation: ""
		}

		i18nInitialized.then((t) => {
			i18next.loadNamespaces(["translations","common","en","common_en"], () => {
				this.setState({
					emailTranslation: t("common:login.email"),
					passwordTranslation: t("common:login.password"),
					confirmTranslation: t("common:login.confirm"),
				});

			});
		}).catch(errorResponseHandler(this));

	}

	componentDidMount(){
		axios.get("/auth", {withCredentials: true}).then(() => {
			window.location.pathname = "../dashboard";
		}).catch(() => {
			jscookie.remove("jwt");
		});

		if(this.props.verified){
			successResponseHandler(this)("Email address verified");
		}
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
				if(this.props.signup){
					this.setState({verifyRequest: true});
				}
				else{
					window.location.pathname = "../dashboard";
				}
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
			{
				!this.state.verifyRequest ? <>
					<div className="Login container-lg mt-md-5" onKeyDown={(event) => {
						if (event.key === 'Enter') {
							this.login(event);
						}
					}}>

						<HrWrapper style={{
							borderBottomColor: "var(--gcs-faded)"
						}} children={
							<h2 className="text-gcs-faded" ><SocialLogin /></h2>
						} />

						<a href="../auth/google" className="col-12 col-md-5 btn btn-lg mt-3 mb-2 mb-md-4 mr-md-4 btn-info">
							<FaGoogle style={{marginTop: "-1%"}}/> <Google />
						</a>
						<a href="../auth/spotify" className="col-12 col-md-5 btn btn-lg mt-md-3 mb-4 ml-md-4 btn-success">
							<FaSpotify style={{marginTop: "-1%"}}/> <Spotify />
						</a>

						<HrWrapper style={{
							borderBottomColor: "var(--gcs-faded)"
						}} children={
							<h2 className="text-gcs-faded" >{this.props.signup ? <EmailSignup /> : <EmailLogin />}</h2>
						} />

						<FloatingLabel
							className="col-12 mb-2 mt-3 px-0"
							id="email"
							label={this.state.emailTranslation}
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
								label={this.state.passwordTranslation}
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
									label={this.state.confirmTranslation}
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
							className={`col-12 mb-1 btn btn-${this.state.processing ? "gcs-elevated" : "gcs-bright"}`}>{
							this.state.processing
							? `Processing`
							: this.props.signup ? <SignUpHeader /> : <LoginHeader />
						}</button>

						<a href={this.props.signup ? "../login" : "../login?signup=1"} className="mb-5 text-gcs-alpine">
							{!this.props.signup ? <SignupMessage /> : <LoginMessage />}
						</a>

					</div>
				</> : <>
					<div className="verifyEmail text-gcs-alpine">
						<span><h3><ThankYou /></h3><h3 className="ml-2 text-gcs-bright">GCS Radio</h3></span>
						<h4><Verify /></h4>
					</div>
				</>
			}
			<Response response={this.state} lifetime={3000} />
		</>
	}
}
