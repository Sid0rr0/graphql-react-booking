const { UserType, UserInputType } = require("../types/types");
const UserModel = require("../../models/user");
const bcrypt = require("bcryptjs");


module.exports = {
	createUser: {
		type: UserType,
		description: "Create a user",
		args: {
			userInput: { type: UserInputType },
		},
		resolve: async (parent, args) => {
			try {
				const fetchedUser = await UserModel.findOne({
					email: args.userInput.email,
				});
				if (fetchedUser) throw new Error("Email already used.");

				const hashedPass = await bcrypt.hash(
					args.userInput.password,
					12
				);

				const newUser = new UserModel({
					email: args.userInput.email,
					password: hashedPass,
				});

				const result = await newUser.save();
				return { ...result._doc, password: null };
			} catch (err) {
				console.log(err);
				throw err;
			}
		},
	},
};
