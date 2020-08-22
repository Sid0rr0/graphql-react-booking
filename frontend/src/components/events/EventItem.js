import React from "react";
import "./EventItem.css";

export default function EventItem(props) {
	return (
		<li key={props.eventId} className="events__list-item">
			<div>
				<h1>{props.title}</h1>
				<h2>
					Price: {props.price} Diamonds |{" "}
					{new Date(props.date).toLocaleDateString()}
				</h2>
			</div>
			<div>
				{props.userId === props.creatorId ? (
					<p>You're the owner of the event</p>
				) : (
					<button
						className="btn"
						onClick={() => props.onDetail(props.eventId)}
					>
						View Details
					</button>
				)}
			</div>
		</li>
	);
}
