const { dateToString } = require("../../helpers/date");
const UserModel = require("../../models/user");
const EventModel = require("../../models/event");
const DataLoader = require("dataloader");

const getEvent = async eventId => {
	try {
		const fetchedEvent = await eventLoader.load(eventId.toString());
		return fetchedEvent;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const getEvents = async eventIds => {
	try {
		const fetchedEvents = await EventModel.find({ _id: { $in: eventIds } });
		return fetchedEvents.map(event => {
			return transformEvent(event);
		});
	} catch (err) {
		console.log(err);
		throw err;
	}
};

const getUser = async userId => {
	try {
		const fetchedUser = await userLoader.load(userId.toString());
		return {
			...fetchedUser._doc,
			createdEvents: eventLoader.load.bind(
				this,
				fetchedUser._doc.createdEvents
			),
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

const eventLoader = new DataLoader(eventIds => {
	return getEvents(eventIds);
});

const userLoader = new DataLoader(userIds => {
	return UserModel.find({ _id: { $in: userIds } });
});

module.exports = {
	getEvent,
	getEvents,
	getUser,
	transformEvent,
	transformBooking,
};
