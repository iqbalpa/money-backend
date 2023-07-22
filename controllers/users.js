const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const loginRouter = require("express").Router();

loginRouter.post("/signup", async (request, response) => {
	const { name, username, password, age } = request.body;
	if (!(username && password)) {
		return response.status(401).json({ error: "username and password cannot be emptied" });
	}
	if (password.length < 3) {
		return response.status(401).json({ error: "password length minimal is 3" });
	}
	const isUserExist = (await User.findOne({ username })) ? true : false;
	if (isUserExist) {
		return response.status(401).json({ error: "username already exist" });
	}

	const passwordHash = await bcrypt.hash(password, 10);
	const user = new User({ name, username, passwordHash, age });
	await user.save();
	response.status(201).send("user created");
});

loginRouter.post("/login", async (request, response) => {
	const { username, password } = request.body;
	const user = await User.findOne({ username });
	const isPasswordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

	if (!(user && isPasswordCorrect)) {
		return response.status(401).json({ error: "invalid username or password" });
	}

	const userForToken = {
		username: user.username,
		id: user.id,
	};
	const token = jwt.sign(userForToken, process.env.SECRET);

	response.status(200).json({ token, username: user.username, name: user.name, age: user.age });
});

loginRouter.get("/", async (request, response) => {
	const users = await User.find({});
	const result = users.map((user) => ({ username: user.username, name: user.name, id: user.id, age: user.age }));
	response.status(200).json(result);
});

module.exports = loginRouter;
