import express from "express";
import { socketHandler } from "./microservices/sockets/socketRoutes";
import fileupload from "express-fileupload";
import { initDB } from "./db/init";
import { getTimedateNow } from "./utils/datetime";
const config = require("config");
const cookieParser = require("cookie-parser");

console.log(`---------- Server reload ${getTimedateNow()} ----------`);

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
	} catch (error) {
		console.log(
			`${getTimedateNow()}: "error URI": "${req.path}", IP: "${req.ip
				.split(`:`)
				.pop()}"`
		);
		res.status(404).json({ message: "pnf" });
	}
});

app.use("/static", express.static(__dirname + "/static"));
app.use("/favicon.ico", express.static(__dirname + "/favicon.ico"));

app.use("/", require("./microservices/all/towns/townsRoutes"));
app.use("/", require("./microservices/all/auth/authRoutes"));
app.use("/", require("./microservices/all/complaints/complaintsRoutes"));
app.use("/", require("./microservices/all/dialogs/dialogsRoutes"));
app.use("/", require("./microservices/all/images/imagesRoutes"));
app.use("/", require("./microservices/user/likes/likesRoutes"));
app.use("/", require("./microservices/user/profile/profileRoutes"));
app.use("/", require("./microservices/user/shop/rating/ratingRoutes"));
app.use("/", require("./microservices/user/shop/paid/filters/filtersRoutes"));
app.use(
	"/",
	require("./microservices/user/shop/paid/historymessages/historymessagesRoutes")
);
app.use(
	"/",
	require("./microservices/user/shop/paid/interests/interestsRoutes")
);
app.use("/", require("./microservices/user/shop/paid/messages/messagesRoutes"));
app.use("/", require("./microservices/user/shop/paid/photo/photoRoutes"));
app.use(
	"/",
	require("./microservices/user/shop/stickerpacks/stickerpacksRoutes")
);
app.use("/", require("./microservices/admin/profile/profileRoutes"));

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
	} catch (error) {
		console.log("Socket error with:", error.message);
	}
}

async function startServer() {
	try {
		app.listen(httpPORT, () => {
			console.log(`Server started on port: "${httpPORT}"`);
		});
	} catch (error) {
		console.log("Server error with:", error.message);
	}
}

initDB();
startServer();
startSocket();
