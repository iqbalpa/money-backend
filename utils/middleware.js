const jwt = require("jsonwebtoken");
const User = require("../models/user");

const errorHandler = (error, req, res, next) => {
	console.log(error.message);
	if (error.name === "CastError") {
		return res.status(204).send({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return res.status(400).json({ error: error.message });
	} else if (error.name === "JsonWebTokenError") {
		return response.status(400).json({ error: error.message });
	}
	next(error);
};

const tokenExtractor = (req, res, next) => {
	const authorization = req.get("authorization");
	if (authorization && authorization.startsWith("Bearer ")) {
		req.token = authorization.replace("Bearer ", "");
	}
	next();
};

const userExtractor = async (req, res, next) => {
	const decodedToken = jwt.verify(req.token, process.env.SECRET);
	const user = await User.findById(decodedToken.id);
	req.user = user;
	next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
