import * as React from "react";
import "./HrWrapper.css";

export default ({ children, style } : { children: any, style?: React.CSSProperties }) => (
	<div style={style ?? {}} className="HrWrapper">{
		children
	}</div>
);
