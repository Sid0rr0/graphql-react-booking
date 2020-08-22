import React from "react";
import "./EventItem.css";
import AuthContext from "../../context/auth-context";

export default function EventItem(props) {
	return (
		<li key={props.eventId} className="events__list-item">
			<div>
				<h1>{props.title}</h1>
				<h2>Price: {props.price}</h2>
			</div>
			<div>
				{props.userId === props.creatorId ? (
					<p>You're the owner of the event</p>
				) : (
					<button className="btn">View Details</button>
				)}
			</div>
		</li>
	);
}
