import "./landing.scss";

import {useTranslation} from "react-i18next";

const Browse = () => <>{useTranslation("common").t("landing.browse")}</>
const Build = () => <>{useTranslation("common").t("landing.build")}</>
const Login = () => <>{useTranslation("common").t("landing.login")}</>
const SignUp = () => <>{useTranslation("common").t("landing.signup")}</>

const Welcome1 = () => <>{useTranslation("common").t("landing.welcome1")}</>
const Welcome2 = () => <>{useTranslation("common").t("landing.welcome2")}</>
const Welcome3 = () => <>{useTranslation("common").t("landing.welcome3")}</>
const Welcome4 = () => <>{useTranslation("common").t("landing.welcome4")}</>


interface IProps {}
interface IState {}
export default class Landing extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
	}

	render(){
		return <>
			<div className="Landing">
				<h1>GCS Radio</h1>
				<div className="container-fluid">
					<a href="./browse" className="btn btn-gcs-faded row col-12 p-1"><Browse /></a>
					<a href="./build" className="btn btn-gcs-bright row col-12 p-1"><Build /></a>
					<div className="row mt-2 mb-1">
						<a href="./login"><h6 className="col-4"><Login /></h6></a>
						<h6 className="mx-n2 text-gcs-alpine">|</h6>
						<a href="./login?signup=1"><h6 className="col-4"><SignUp /></h6></a>
					</div>
					<p className="mt-md-5 mb-2 text-gcs-alpine">
						<Welcome1 /><a className="text-gcs-bright mx-1" target="_blank" href="https://gitlab.com/brennanwilkes/gcs-radio">GitLab</a>
					</p>
					<p className="mt-md-2 mb-2 text-gcs-alpine">
						<Welcome2 /><a className="text-gcs-bright mx-1" target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>
					</p>
					<p className="mt-md-2 mb-2 text-gcs-alpine">
						<Welcome3 /><a className="text-gcs-bright mx-1" target="_blank" href="mailto:brennan@codexwilkes.com">brennan@codexwilkes.com</a><Welcome4 />
					</p>
				</div>
			</div>
		</>
	}
}
