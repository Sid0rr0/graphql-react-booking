const {
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLList,
	GraphQLFloat,
	GraphQLString,
	GraphQLID,
	GraphQLInputObjectType,
	GraphQLInt,
} = require("graphql");

const EventType = new GraphQLObjectType({
	name: "Event",
	description: "This represents an event",
	fields: () => ({
		_id: { type: GraphQLNonNull(GraphQLID) },
		title: { type: GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLNonNull(GraphQLString) },
		price: { type: GraphQLNonNull(GraphQLFloat) },
		date: { type: GraphQLNonNull(GraphQLString) },
		creator: { type: GraphQLNonNull(UserType) },
	}),
});

const EventInputType = new GraphQLInputObjectType({
	name: "EventInput",
	description: "This represents an event input",
	fields: () => ({
		title: { type: GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLNonNull(GraphQLString) },
		price: { type: GraphQLNonNull(GraphQLFloat) },
		date: { type: GraphQLNonNull(GraphQLString) },
	}),
});

const UserType = new GraphQLObjectType({
	name: "User",
	description: "This represents a user",
	fields: () => ({
		_id: { type: GraphQLNonNull(GraphQLID) },
		email: { type: GraphQLNonNull(GraphQLString) },
		password: { type: GraphQLString },
		createdEvents: { type: GraphQLList(GraphQLNonNull(EventType)) },
	}),
});

const UserInputType = new GraphQLInputObjectType({
	name: "UserInput",
	description: "This represents a user input",
	fields: () => ({
		email: { type: GraphQLNonNull(GraphQLString) },
		password: { type: GraphQLNonNull(GraphQLString) },
	}),
});

const BookingType = new GraphQLObjectType({
	name: "Booking",
	description: "This represents booking",
	fields: () => ({
		_id: { type: GraphQLNonNull(GraphQLID) },
		event: { type: GraphQLNonNull(EventType) },
		user: { type: GraphQLNonNull(UserType) },
		createdAt: { type: GraphQLNonNull(GraphQLString) },
		updatedAt: { type: GraphQLNonNull(GraphQLString) },
	}),
});

const AuthType = new GraphQLObjectType({
	name: "Login",
	description: "This represents login",
	fields: () => ({
		userId: { type: GraphQLNonNull(GraphQLID) },
		token: { type: GraphQLNonNull(GraphQLString) },
		tokenExpiration: { type: GraphQLNonNull(GraphQLInt) },
	}),
});

module.exports = {
	EventType,
	EventInputType,
	UserType,
	UserInputType,
	BookingType,
	AuthType,
};
