const express = require("express");
const app = express();

app.get("/", async (req, res) => {
	res.json({ message: "this endpoint works!" }).status(200);
});

app.listen(3000, () => {
	console.log("listen to port 3000");
});
