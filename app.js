const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLNonNull,
	GraphQLList,
	GraphQLInt,
	GraphQLFloat,
	GraphQLString,
	GraphQLID,
	GraphQLInputObjectType,
} = require("graphql");

const app = express();

app.use(express.json());

const events = [];

const EventType = new GraphQLObjectType({
	name: "Event",
	description: "This represents an event",
	fields: () => ({
		_id: { type: GraphQLNonNull(GraphQLID) },
		title: { type: GraphQLNonNull(GraphQLString) },
		description: { type: GraphQLNonNull(GraphQLString) },
		price: { type: GraphQLNonNull(GraphQLFloat) },
		date: { type: GraphQLNonNull(GraphQLString) },
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

const RootQueryType = new GraphQLObjectType({
	name: "Query",
	description: "Root query",
	fields: () => ({
		event: {
			type: EventType,
			description: "A single event",
			args: {
				_id: { type: GraphQLID },
			},
			resolve: (parent, args) => {
				return events.find(event => event._id === args._id);
			},
		},
		events: {
			type: GraphQLList(EventType),
			description: "List of all events",
			resolve: () => {
				return events;
			},
		},
	}),
});

const RootMutationType = new GraphQLObjectType({
	name: "Mutation",
	description: "Root mutation",
	fields: () => ({
		createEvent: {
			type: EventType,
			description: "Create an event",
			args: {
				eventInput: { type: EventInputType },
			},
			resolve: (parent, args) => {
				const event = {
					_id: events.length + 1,
					title: args.eventInput.title,
					description: args.eventInput.description,
					price: +args.eventInput.price,
					date: args.eventInput.date,
				};
				events.push(event);
				return event;
			},
		},
	}),
});

const schema = new GraphQLSchema({
	query: RootQueryType,
	mutation: RootMutationType,
});

app.use(
	"/graphql",
	graphqlHTTP({
		schema: schema,
		graphiql: true,
	})
);

app.listen(3000, () => console.log("Server running"));
