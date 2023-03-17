import { testToken } from "../auth/token";
import { setTimecodeToDB } from "../auth/authDB";
import { setLikesById } from "../profile/likes/likesUtils";
import { setDialog } from "../dialogs/dialogsUtils";
import { setVisitByIdToDB } from "../statistics/statisticsDB";
import { botPhraseCensure, botPhraseSpam } from "../bots/botsUtils";
import { setAdminBannedByIdToDB } from "../admin/adminDB";
import { IQuerySendMessage, MESSAGETYPE } from "../dialogs/idialogs";
import { IQuerySendSticker } from "../shop/stickerpacks/istickerpacks";
import { IQueryLike } from "../profile/likes/ilikes";

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
	useridarr: string[],
	nameCommand: string,
	payload: object
) => {
	arrOfSockets.forEach((socketuser) => {
		if (useridarr.includes(socketuser.userid))
			socketIO.to(socketuser.socketid).emit(nameCommand, payload);
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

			const testBotSpam = botPhraseSpam(socket.message);
			if (testBotSpam.enabled) {
				setAdminBannedByIdToDB(ourId, {
					timecode: testBotSpam.timecode,
					whobanned: testBotSpam.whobanned,
					discription: testBotSpam.discription,
				});
				socketIO.to(socketId).emit("delete_jwt");

				return;
			}
			const testBotCensure = botPhraseCensure(socket.message);
			if (testBotCensure.enabled) {
				setAdminBannedByIdToDB(ourId, {
					timecode: testBotCensure.timecode,
					whobanned: testBotCensure.whobanned,
					discription: testBotCensure.discription,
				});
				socketIO.to(socketId).emit("delete_jwt");

				return;
			}

			if (ourId === socket.userid) return;

			const dialog = await setDialog(
				ourId,
				socket.userid,
				MESSAGETYPE.message,
				socket.message,
				"",
				0
			);

			// socketIO.to(socketId).emit("dialog", dialog);

			const data = {
				command: "add",
				userid1: ourId,
				userid2: socket.userid,
				message: dialog.messages[dialog.messages.length - 1],
			};

			sendToAllSocketsById(
				socketIO,
				[ourId, socket.userid],
				"message",
				data
			);
		} catch (error) {
			console.log("message error", error);
		}
	});

	socket.on("sticker", async (socket: IQuerySendSticker) => {
		try {
			const ourId = getUserIdFromSocketTable(socketId);

			if (!(ourId && socket.userid)) return;

			if (ourId === socket.userid) return;

			const dialog = await setDialog(
				ourId,
				socket.userid,
				MESSAGETYPE.sticker,
				"",
				socket.stickerpackid,
				socket.stickerpos
			);

			// socketIO.to(socketId).emit("dialog", dialog);

			const data = {
				command: "add",
				userid1: ourId,
				userid2: socket.userid,
				message: dialog.messages[dialog.messages.length - 1],
			};

			sendToAllSocketsById(
				socketIO,
				[ourId, socket.userid],
				"message",
				data
			);
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

			sendToAllSocketsById(socketIO, [socket.userid], "get_like", data);
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
