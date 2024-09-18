import React from "react";

function Alert({ children, alertType, style, others=false }) {
	return (
		<>
		{others ? (
			<div className="alert--overlay">
				<div style={style} className={`alert alert--${alertType}`}>
					{children}
				</div>
			</div>
		) : (
			<div style={style} className={`alert alert--${alertType}`}>
					{children}
			</div>
		)}
		</>
	);
}

export default Alert;
