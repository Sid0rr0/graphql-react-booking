import React from "react";
import "./EventList.css";
import EventItem from "./EventItem";

export default function EventList(props) {
	const events = props.events.map(event => {
		return (
			<EventItem
				key={event._id}
				eventId={event._id}
				title={event.title}
				price={event.price}
				userId={props.authUserId}
				creatorId={event.creator._id}
			/>
		);
	});

	return (
		<div>
			<ul className="event__list">{events}</ul>
		</div>
	);
}
