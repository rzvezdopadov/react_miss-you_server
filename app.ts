import express from "express";
import { socketHandler } from "./microservices/sockets/socketsAPI";
import fileupload from "express-fileupload";
import { initDB } from "./db/init";
import path from "path";
const config = require("config");
const cookieParser = require("cookie-parser");

console.log("-------------------------------------------------------");

const app = express();

app.use(cookieParser());
app.use(
	fileupload({
		createParentPath: true,
		limits: {
			fileSize: 100000,
		},
		abortOnLimit: true,
	})
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
	try {
		decodeURIComponent(req.path);
		next();
	} catch (e) {
		console.log(`error URI: ${req.path}, IP: ${req.ip.split(`:`).pop()}`);
		res.status(404).json({ message: "pnf" });
	}
});

app.use("/static", express.static(__dirname + "/static"));
app.use("/favicon.ico", express.static(__dirname + "/favicon.ico"));

app.use("/", require("./microservices/auth/authRoutes"));
app.use("/", require("./microservices/user/userRoutes"));
app.use("/", require("./microservices/images/imagesRoutes"));
// app.use("/", require("./microservices/shop/shopRoutes"));
// app.use("/", require("./microservices/guest/guestRoutes"));
// app.use("/", require("./microservices/complaints/complaintsRoutes"));
// app.use("/", require("./microservices/service/serviceRoutes"));
app.use("/", require("./microservices/admin/adminRoutes"));
app.use("/", require("./api"));

const httpPORT = config.get("httpPort") || 5000;
const socketPORT = config.get("socketPort") || 8000;

const http = require("http").Server(app);
const socketIO = require("socket.io")(http);

socketIO.on("connection", (socket) => socketHandler(socketIO, socket));

async function startSocket() {
	try {
		http.listen(socketPORT, () => {
			console.log(`Socket started on port: "${socketPORT}"`);
		});
	} catch (e) {
		console.log("Socket error with:", e.message);
	}
}

async function startServer() {
	try {
		app.listen(httpPORT, () => {
			console.log(`Server started on port: "${httpPORT}"`);
		});
	} catch (e) {
		console.log("Server error with:", e.message);
	}
}

initDB();
startServer();
startSocket();
