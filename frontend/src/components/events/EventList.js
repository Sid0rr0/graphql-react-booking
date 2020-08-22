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
				date={event.date}
				userId={props.authUserId}
				creatorId={event.creator._id}
				onDetail={props.onViewDetail}
			/>
		);
	});

	return (
		<div>
			<ul className="event__list">{events}</ul>
		</div>
	);
}
