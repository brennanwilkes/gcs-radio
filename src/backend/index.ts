import express from "express";
import bodyParser from "body-parser";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Static routing for public files
app.use("/", express.static(path.join(__dirname, "..", "public-frontend")));

// 404 messages
app.get("*", (req, res) => {
	console.log("Received invalid GET request for", req.url);

	res.writeHead(404, { "Content-Type": "text/html" });
	res.write("<h1>404: If you see this, it's already too late!</h1>");
	res.end();
});

app.listen(PORT, () => {
	console.log(`server started at http://localhost:${PORT}`);
});
