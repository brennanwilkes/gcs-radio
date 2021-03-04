import * as React from "react";
import "./responsiveContainer.css";

export default ({ children } : { children: any }) => (
	<div className="ResponsiveContainer">{
		children
	}</div>
);
