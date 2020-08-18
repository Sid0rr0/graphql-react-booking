const { dateToString } = require("../../helpers/date");
const UserModel = require("../../models/user");
const EventModel = require("../../models/event");


const getEvent = async eventId => {
	try {
		const fetchedEvent = await EventModel.findById(eventId);
		return {
			...fetchedEvent._doc,
			creator: getUser.bind(this, fetchedEvent.creator),
		};
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const getEvents = async eventIds => {
	try {
		const events = await EventModel.find({ _id: { $in: eventIds } });
		return events.map(event => {
			return {
				...event._doc,
				date: new Date(event._doc.date).toISOString(),
				creator: getUser.bind(this, event.creator),
			};
		});
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const getUser = async userId => {
	try {
		const oneUser = await UserModel.findById(userId);
		return {
			...oneUser._doc,
			createdEvents: getEvents.bind(this, oneUser._doc.createdEvents),
		};
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const transformEvent = event => {
	return {
		...event._doc,
		date: new Date(event._doc.date).toISOString(),
		creator: getUser.bind(this, event._doc.creator),
	};
};

const transformBooking = booking => {
	return {
		...booking._doc,
		createdAt: dateToString(booking._doc.createdAt),
		updatedAt: dateToString(booking._doc.updatedAt),
		user: getUser.bind(this, booking._doc.user),
		event: getEvent.bind(this, booking._doc.event),
	};
};

module.exports = {
	getEvent,
	getEvents,
	getUser,
	transformEvent,
	transformBooking,
};
