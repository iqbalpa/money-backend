const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
	amount: Number,
	date: Date,
	category: String,
	isExpense: Boolean, // true if expense, false if income
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

expenseSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Expense", expenseSchema);
