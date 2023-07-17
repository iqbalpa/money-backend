const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const logger = require("./utils/logger");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const loginRouter = require("./controllers/users");
const expenseRouter = require("./controllers/expenses");

mongoose
	.connect(config.MONGO_URI)
	.then(() => logger.info("connected to database"))
	.catch((err) => logger.error("failed to connect the database", err));

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use("/api/users", loginRouter);
app.use("/api/expenses", middleware.userExtractor, expenseRouter);

module.exports = app;
