import { IQueryLike, IQuerySendMessage } from "../interfaces/iprofiles";
import { testToken } from "../utils/token";
import { setTimecodeToDB } from "../query/auth";
import { setLikesById } from "../utils/likes";
import { setDialog } from "../utils/dialogs";
import { getVisitByIdFromDB, setVisitByIdToDB } from "../query/statistics";

interface ISocketUser {
	userId: number;
	socketId: string;
}

const arrOfSockets: Array<ISocketUser> = [];

const getUserIdFromSocketTable = (socketId) => {
	for (let i = 0; i < arrOfSockets.length; i++) {
		if (arrOfSockets[i].socketId === socketId) {
			return arrOfSockets[i].userId;
		}
	}

	return 0;
};

const sendToAllSocketsById = (
	socketIO,
	id: number,
	nameCommand: string,
	payload: object
) => {
	arrOfSockets.forEach((value) => {
		if (value.userId === id)
			socketIO.to(value.socketId).emit(nameCommand, payload);
	});
};

export const socketHandler = (socketIO, socket) => {
	const socketId = socket.id;

	socketIO.to(socketId).emit("get_jwt");

	socket.on("ping", async function () {
		const ourId = getUserIdFromSocketTable(socketId);

		setTimecodeToDB(ourId);
	});

	socket.on("get_jwt", async function (socket) {
		const { jwt } = socket;

		if (!jwt) setTimeout(() => socketIO.to(socketId).emit("get_jwt"), 2000);

		try {
			const tokenDecode = await testToken(jwt);

			if (!tokenDecode) return;

			const socketUser: ISocketUser = {
				userId: tokenDecode.userId,
				socketId: socketId,
			};

			const socketPos = arrOfSockets.findIndex(
				(value) => value.socketId === socketId
			);

			if (socketPos !== -1) return;

			arrOfSockets.push(socketUser);

			setVisitByIdToDB(socketId, tokenDecode.userId, "open");
		} catch (error) {
			console.log("get_jwt error", error);
		}
	});

	socket.on("message", async (socket: IQuerySendMessage) => {
		try {
			const ourId = getUserIdFromSocketTable(socketId);

			if (!(ourId && socket.id)) return;

			const dialog = await setDialog(ourId, socket.id, socket.message);

			socketIO.to(socketId).emit("dialog", dialog);

			const data = {
				command: "add",
				userId: ourId,
				message: dialog.messages[dialog.messages.length - 1],
			};

			sendToAllSocketsById(socketIO, socket.id, "message", data);
		} catch (error) {
			console.log("message error", error);
		}
	});

	socket.on("set_like", async (socket: IQueryLike) => {
		try {
			const ourId = getUserIdFromSocketTable(socketId);

			const likes = await setLikesById(ourId, socket.id);

			socketIO.to(socketId).emit("set_like", likes);

			const data = {
				command: "delete",
				userId: ourId,
			};

			if (likes.length) data.command = "add";

			sendToAllSocketsById(socketIO, socket.id, "get_like", data);
		} catch (error) {
			console.log("set_like error", error);
		}
	});

	socket.on("get_likes", function (socket) {
		console.log("get_likes");
	});

	socket.on("disconnect", function () {
		const userIndex = arrOfSockets.findIndex(
			(socketUser) => socketUser.socketId === socketId
		);

		if (userIndex === -1) return;

		setVisitByIdToDB(socketId, arrOfSockets[userIndex].userId, "closed");

		arrOfSockets.splice(userIndex, 1);
	});
};
