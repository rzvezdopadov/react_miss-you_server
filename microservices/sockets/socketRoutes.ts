import {
	socketClosedHandler,
	socketGetJWTHandler,
	socketMessageHandler,
	socketPingHandler,
	socketSetBannedUserHandler,
	socketSetFavoriteUserHandler,
	socketSetLikeHandler,
	socketStickerHandler,
} from "./socketAPI";

export const socketHandler = (socketIO, socket) => {
	const socketId = socket.id;

	socketIO.to(socketId).emit("get_jwt");

	socket.on("ping", () => socketPingHandler(socketId));

	socket.on("get_jwt", (socket) =>
		socketGetJWTHandler(socketIO, socket, socketId)
	);

	socket.on("message", (socket) => {
		socketMessageHandler(socketIO, socket, socketId);
	});

	socket.on("sticker", (socket) =>
		socketStickerHandler(socketIO, socket, socketId)
	);

	socket.on("set_like", (socket) =>
		socketSetLikeHandler(socketIO, socket, socketId)
	);

	socket.on("set_favoriteusers", (socket) =>
		socketSetFavoriteUserHandler(socketIO, socket, socketId)
	);

	socket.on("set_bannedusers", (socket) =>
		socketSetBannedUserHandler(socketIO, socket, socketId)
	);

	socket.on("get_likes", function (socket) {
		console.log("get_likes");
	});

	socket.on("disconnect", () => socketClosedHandler(socketId));
};
