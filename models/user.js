const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: String,
	username: {
		type: String,
		minLength: 3,
		unique: true,
	},
	passwordHash: String,
	age: Number,
	expenses: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Expense",
		},
	],
});

userSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("User", userSchema);
