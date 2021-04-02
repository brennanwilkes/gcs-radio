import * as React from "react";
import "./landing.scss";

import {useTranslation} from "react-i18next";

const Browse = () => <>{useTranslation("common").t("landing.browse")}</>
const Build = () => <>{useTranslation("common").t("landing.build")}</>
const Login = () => <>{useTranslation("common").t("landing.login")}</>
const SignUp = () => <>{useTranslation("common").t("landing.signup")}</>


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
					<a href="./browser" className="btn btn-gcs-faded row col-12 p-1"><Browse /></a>
					<a href="./builder" className="btn btn-gcs-bright row col-12 p-1"><Build /></a>
					<div className="row my-2">
						<a href="./login"><h6 className="col-4"><Login /></h6></a>
						<h6 className="mx-n2 text-gcs-alpine">|</h6>
						<a href="./login?signup=1"><h6 className="col-4"><SignUp /></h6></a>
					</div>
				</div>
			</div>
		</>
	}
}
