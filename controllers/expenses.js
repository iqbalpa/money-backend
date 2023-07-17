const expenseRouter = require("express").Router();
const Expense = require("../models/expense");

// create new expense
expenseRouter.post("/", async (request, response) => {
	const { amount, category, isExpense } = request.body;

	// error if amount/category is missing
	if (!amount) {
		return response.status(400).json({ error: "amount is missing" });
	}
	if (!category) {
		return response.status(400).json({ error: "category is missing" });
	}

	const date = new Date();
	const user = request.user;

	// create new expense
	const expense = new Expense({ amount, date, category, isExpense, user: user.id });
	const savedExpense = await expense.save();

	// update user data
	user.expenses = user.expenses.concat(savedExpense.id);
	await user.save();
	response.status(201).json(savedExpense);
});

// get all expenses
expenseRouter.get("/", async (request, response) => {
	const user = request.user;
	const expenses = await Expense.find({ user: user.id });
	response.status(200).json(expenses);
});

// get expense by id
expenseRouter.get("/:id", async (request, response) => {
	const id = request.params.id;
	const expense = await Expense.findById(id);
	if (!expense) {
		return response.status(404).json({ error: "expense not found" });
	}

	response.status(200).json(expense);
});

// update expense by id
expenseRouter.patch("/:id", async (request, response) => {
	const id = request.params.id;
	const expense = await Expense.findById(id);
	if (!expense) {
		return response.status(404).json({ error: "expense not found" });
	}

	const newData = request.body;
	const result = await Expense.findByIdAndUpdate(id, newData, { new: true });
	response.status(200).json(result);
});

// delete expense by id
expenseRouter.delete("/:id", async (request, response) => {
	const id = request.params.id;
	const expense = await Expense.findById(id);
	if (!expense) {
		return response.status(404).json({ error: "expense not found" });
	}

	const user = request.user;
	user.expenses = user.expenses.filter((expenseId) => expenseId.toString() !== id);
	await user.save();

	await Expense.findByIdAndDelete(id);
	response.status(204).json({ message: "expense deleted" });
});

module.exports = expenseRouter;
