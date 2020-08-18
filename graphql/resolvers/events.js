const { GraphQLList } = require("graphql");
const { EventType, EventInputType } = require("../types/types");
const EventModel = require("../../models/event");
const UserModel = require("../../models/user");
const { transformEvent } = require("./merge");


module.exports = {
	events: {
		type: GraphQLList(EventType),
		description: "List of all events",
		resolve: async () => {
			try {
				const events = await EventModel.find();
				return events.map(event => {
					return transformEvent(event);
				});
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},
	createEvent: {
		type: EventType,
		description: "Create an event",
		args: {
			eventInput: { type: EventInputType },
		},
		resolve: async (parent, args) => {
			try {
				const newEvent = new EventModel({
					title: args.eventInput.title,
					description: args.eventInput.description,
					price: +args.eventInput.price,
					date: new Date(args.eventInput.date),
					creator: "5f3a94a20168e645242fc345",
				});

				const creator = await UserModel.findById(
					"5f3a94a20168e645242fc345"
				);
				if (!creator) throw new Error("User not found.");

				const result = await newEvent.save();
				creator.createdEvents.push(newEvent);
				await creator.save();

				const savedEvent = transformEvent(result);

				return savedEvent;
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},
};
