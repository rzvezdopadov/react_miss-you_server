import {
	IQueryLike,
	IQuerySendMessage,
	IQuerySendSticker,
} from "../interfaces/iprofiles";
import { testToken } from "../utils/token";
import { setTimecodeToDB } from "../query/auth";
import { setLikesById } from "../utils/likes";
import { setDialog } from "../utils/dialogs";
import { setVisitByIdToDB } from "../query/statistics";

interface ISocketUser {
	userid: string;
	socketid: string;
}

const arrOfSockets: Array<ISocketUser> = [];

const getUserIdFromSocketTable = (socketId) => {
	for (let i = 0; i < arrOfSockets.length; i++) {
		if (arrOfSockets[i].socketid === socketId) {
			return arrOfSockets[i].userid;
		}
	}

	return "";
};

const sendToAllSocketsById = (
	socketIO,
	userid: string,
	nameCommand: string,
	payload: object
) => {
	arrOfSockets.forEach((value) => {
		if (value.userid === userid)
			socketIO.to(value.socketid).emit(nameCommand, payload);
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
				userid: tokenDecode.userId,
				socketid: socketId,
			};

			const socketPos = arrOfSockets.findIndex(
				(value) => value.socketid === socketId
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

			if (!(ourId && socket.userid)) return;

			const dialog = await setDialog(
				ourId,
				socket.userid,
				socket.message
			);

			socketIO.to(socketId).emit("dialog", dialog);

			const data = {
				command: "add",
				userid: ourId,
				message: dialog.messages[dialog.messages.length - 1],
			};

			sendToAllSocketsById(socketIO, socket.userid, "message", data);
		} catch (error) {
			console.log("message error", error);
		}
	});

	socket.on("sticker", async (socket: IQuerySendSticker) => {
		try {
			const ourId = getUserIdFromSocketTable(socketId);

			if (!(ourId && socket.userid)) return;

			const dialog = await setDialog(
				ourId,
				socket.userid,
				socket.stickerid
				// socket.stickerpos
			);

			socketIO.to(socketId).emit("dialog", dialog);

			const data = {
				command: "add",
				userid: ourId,
				message: dialog.messages[dialog.messages.length - 1],
			};

			sendToAllSocketsById(socketIO, socket.userid, "message", data);
		} catch (error) {
			console.log("message error", error);
		}
	});

	socket.on("set_like", async (socket: IQueryLike) => {
		try {
			const ourId = getUserIdFromSocketTable(socketId);

			const likes = await setLikesById(ourId, socket.userid);

			socketIO.to(socketId).emit("set_like", likes);

			const data = {
				command: "delete",
				userId: ourId,
			};

			if (likes.length) data.command = "add";

			sendToAllSocketsById(socketIO, socket.userid, "get_like", data);
		} catch (error) {
			console.log("set_like error", error);
		}
	});

	socket.on("get_likes", function (socket) {
		console.log("get_likes");
	});

	socket.on("disconnect", function () {
		const userIndex = arrOfSockets.findIndex(
			(socketUser) => socketUser.socketid === socketId
		);

		if (userIndex === -1) return;

		setVisitByIdToDB(socketId, arrOfSockets[userIndex].userid, "closed");

		arrOfSockets.splice(userIndex, 1);
	});
};
