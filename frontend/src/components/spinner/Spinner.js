import React from "react";
import "./Spinner.css";

export default function Spinner() {
	return (
		<div className="spinner-wrapper">
			<div className="lds-ripple">
				<div></div>
				<div></div>
			</div>
		</div>
	);
}
