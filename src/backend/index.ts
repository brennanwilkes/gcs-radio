import express from "express";

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
	res.send("Welcome to GCS Radio");
});

app.listen(PORT, () => {
	console.log(`server started at http://localhost:${PORT}`);
});
