const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const logger = require("./utils/logger");
const config = require("./utils/config");
const loginRouter = require("./controllers/users");

mongoose
	.connect(config.MONGO_URI)
	.then(() => logger.info("connected to database"))
	.catch((err) => logger.error("failed to connect the database", err));

app.use(cors());
app.use(express.json());

app.use("/api/users", loginRouter);

module.exports = app;
