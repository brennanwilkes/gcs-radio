import "./hrWrapper.css";

export default ({ children, style, className } : { children: any, style?: React.CSSProperties, className?: string }) => (
	<div style={style ?? {}} className={`HrWrapper ${className ?? ""}`}>{
		children
	}</div>
);
