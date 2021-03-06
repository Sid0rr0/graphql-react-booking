const { GraphQLID, GraphQLList } = require("graphql");
const { BookingType, EventType } = require("../types/types");
const { transformEvent, transformBooking } = require("./merge");
const EventModel = require("../../models/event");
const BookingModel = require("../../models/booking");

module.exports = {
	bookings: {
		type: GraphQLList(BookingType),
		description: "List of all bookings",
		resolve: async (parent, args, req) => {
			if (!req.isAuth) {
				throw new Error("Unauthenticated!");
			}
			try {
				const fetchedBookings = await BookingModel.find({
					user: req.userId,
				});
				return fetchedBookings.map(booking => {
					return transformBooking(booking);
				});
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},
	bookEvent: {
		type: BookingType,
		description: "Create a booking",
		args: {
			eventId: { type: GraphQLID },
		},
		resolve: async (parent, args, req) => {
			if (!req.isAuth) {
				throw new Error("Unauthenticated!");
			}
			try {
				const fetchedEvent = await EventModel.findOne({
					_id: args.eventId,
				});
				const newBooking = new BookingModel({
					user: req.userId,
					event: fetchedEvent,
				});
				const result = await newBooking.save();
				return transformBooking(result);
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},
	cancelBooking: {
		type: EventType,
		description: "Cancels a booking",
		args: {
			bookingId: { type: GraphQLID },
		},
		resolve: async (parent, args, req) => {
			if (!req.isAuth) {
				throw new Error("Unauthenticated!");
			}
			try {
				const fetchedBooking = await BookingModel.findById(
					args.bookingId
				).populate("event");
				if (!fetchedBooking) throw new Error("Booking not found.");
				const fetchedEvent = transformEvent(fetchedBooking.event);
				await BookingModel.deleteOne({ _id: args.bookingId });
				return fetchedEvent;
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},
};
