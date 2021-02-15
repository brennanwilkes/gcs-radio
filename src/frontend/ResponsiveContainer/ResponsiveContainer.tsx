import * as React from "react";
import "./ResponsiveContainer.css";

export default ({ children } : { children: any }) => (
	<div className="ResponsiveContainer">{
		children
	}</div>
);
