import express from "express";
import { socketHandler } from "./api/sockets";
import fileupload from "express-fileupload";
import { initDB } from "./db/init";
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

app.use("/", require("./api/api"));

const PORT = config.get("port") || 5000;
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
		app.listen(PORT, () => {
			console.log(`Web started on port: "${PORT}"`);
		});
	} catch (e) {
		console.log("Web error with:", e.message);
	}
}

initDB();
startServer();
startSocket();
