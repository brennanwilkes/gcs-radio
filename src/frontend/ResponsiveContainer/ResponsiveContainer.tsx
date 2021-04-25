import "./responsiveContainer.scss";

export default ({ children } : { children: any }) => (
	<div className="ResponsiveContainer">{
		children
	}</div>
);
