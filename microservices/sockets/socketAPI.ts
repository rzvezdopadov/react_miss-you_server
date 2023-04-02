import { getTimecodeNow } from "../../utils/datetime";
import { setAdminBannedByIdToDB } from "../admin/adminDB";
import { testToken } from "../auth/token";
import { getBannedUsersByIdFromDB } from "../bannedusers/bannedusersDB";
import { setBannedUsersById } from "../bannedusers/bannedusersUtils";
import { IQueryBannedUser } from "../bannedusers/ibannedusers";
import { botPhraseCensure, botPhraseSpam } from "../bots/botsUtils";
import { setDialog } from "../dialogs/dialogsUtils";
import { IQuerySendMessage, MESSAGETYPE } from "../dialogs/idialogs";
import { setFavoriteUsersById } from "../favoriteusers/favoriteusersUtils";
import { IQueryFavoriteUser } from "../favoriteusers/ifavoriteusers";
import { IQueryLike } from "../likes/ilikes";
import { setLikesById } from "../likes/likesUtils";
import { getPaidByIdFromDB } from "../shop/paid/paidDB";
import { IQuerySendSticker } from "../shop/stickerpacks/istickerpacks";
import { setTimecodeToDB } from "../statistics/statisticsDB";
import { setVisitById } from "../statistics/statisticsUtils";
import { ISocketUsers, SOCKET_TYPE_OC } from "./isocket";
import { getUserIdFromSocketTable, sendToAllSocketsById } from "./socketUtils";

const sockets: ISocketUsers[] = [];

export async function socketPingHandler(socketId: string) {
	const ourId = getUserIdFromSocketTable(sockets, socketId);

	setTimecodeToDB(ourId);
}

export async function socketGetJWTHandler(
	socketIO: any,
	socketPayload: any,
	socketId: string
) {
	const { jwt } = socketPayload;

	if (!jwt) setTimeout(() => socketIO.to(socketId).emit("get_jwt"), 2000);

	try {
		const tokenDecode = await testToken(jwt);

		if (!tokenDecode) return;

		const socketUser: ISocketUsers = {
			userid: tokenDecode.userId,
			socketid: socketId,
		};

		const socketPos = sockets.findIndex(
			(value) => value.socketid === socketId
		);

		if (socketPos !== -1) return;

		sockets.push(socketUser);

		setVisitById(socketId, tokenDecode.userId, SOCKET_TYPE_OC.open);
	} catch (error) {
		console.log("get_jwt error", error);
	}
}

export async function socketMessageHandler(
	socketIO: any,
	socketPayload: IQuerySendMessage,
	socketId: string
) {
	try {
		const ourId = getUserIdFromSocketTable(sockets, socketId);

		if (!(ourId && socketPayload.userid)) return;

		const testBotSpam = botPhraseSpam(socketPayload.message);
		if (testBotSpam.enabled) {
			setAdminBannedByIdToDB(ourId, {
				timecode: testBotSpam.timecode,
				whobanned: testBotSpam.whobanned,
				discription: testBotSpam.discription,
			});
			socketIO.to(socketId).emit("delete_jwt");

			return;
		}
		const testBotCensure = botPhraseCensure(socketPayload.message);
		if (testBotCensure.enabled) {
			setAdminBannedByIdToDB(ourId, {
				timecode: testBotCensure.timecode,
				whobanned: testBotCensure.whobanned,
				discription: testBotCensure.discription,
			});
			socketIO.to(socketId).emit("delete_jwt");

			return;
		}

		const paid = await getPaidByIdFromDB(ourId);
		if (paid.messageswrite.timecode < getTimecodeNow()) {
			sendToAllSocketsById(socketIO, sockets, [ourId], "modalmessage", {
				message:
					"У вас закончилась возможность писать сообщения, приобретите данную опцию в магазине!",
			});

			return;
		}

		const bannedusers = await getBannedUsersByIdFromDB(
			socketPayload.userid
		);
		if (bannedusers.includes(ourId)) {
			sendToAllSocketsById(socketIO, sockets, [ourId], "modalmessage", {
				message:
					"Вы не можете написать данному пользователю, вы у него в бан листе!",
			});

			return;
		}

		if (ourId === socketPayload.userid) return;

		const dialog = await setDialog(
			ourId,
			socketPayload.userid,
			MESSAGETYPE.message,
			socketPayload.message,
			"",
			0
		);

		const data = {
			command: "add",
			userid1: ourId,
			userid2: socketPayload.userid,
			message: dialog.messages[0],
		};

		sendToAllSocketsById(
			socketIO,
			sockets,
			[ourId, socketPayload.userid],
			"message",
			data
		);
	} catch (error) {
		console.log("message error", error);
	}
}

export async function socketStickerHandler(
	socketIO: any,
	socketPayload: IQuerySendSticker,
	socketId: string
) {
	try {
		const ourId = getUserIdFromSocketTable(sockets, socketId);

		if (!(ourId && socketPayload.userid)) return;

		if (ourId === socketPayload.userid) return;

		const paid = await getPaidByIdFromDB(ourId);
		if (paid.messageswrite.timecode < getTimecodeNow()) {
			sendToAllSocketsById(socketIO, sockets, [ourId], "modalmessage", {
				message:
					"У вас закончилась возможность писать сообщения, приобретите данную опцию в магазине!",
			});

			return;
		}

		const bannedusers = await getBannedUsersByIdFromDB(
			socketPayload.userid
		);
		if (bannedusers.includes(ourId)) {
			sendToAllSocketsById(socketIO, sockets, [ourId], "modalmessage", {
				message:
					"Вы не можете написать данному пользователю, вы у него в бан листе!",
			});

			return;
		}

		const dialog = await setDialog(
			ourId,
			socketPayload.userid,
			MESSAGETYPE.sticker,
			"",
			socketPayload.stickerpackid,
			socketPayload.stickerpos
		);

		const data = {
			command: "add",
			userid1: ourId,
			userid2: socketPayload.userid,
			message: dialog.messages[0],
		};

		sendToAllSocketsById(
			socketIO,
			sockets,
			[ourId, socketPayload.userid],
			"message",
			data
		);
	} catch (error) {
		console.log("message error", error);
	}
}

export async function socketSetLikeHandler(
	socketIO: any,
	socketPayload: IQueryLike,
	socketId: string
) {
	try {
		const ourId = getUserIdFromSocketTable(sockets, socketId);

		const likes = await setLikesById(ourId, socketPayload.userid);

		socketIO.to(socketId).emit("set_like", likes);

		const data = {
			command: "delete",
			userId: ourId,
		};

		if (likes.length) data.command = "add";

		sendToAllSocketsById(
			socketIO,
			sockets,
			[socketPayload.userid],
			"get_like",
			data
		);
	} catch (error) {
		console.log("set_like error", error);
	}
}

export async function socketSetFavoriteUserHandler(
	socketIO: any,
	socketPayload: IQueryFavoriteUser,
	socketId: string
) {
	try {
		const ourId = getUserIdFromSocketTable(sockets, socketId);

		const favoriteusers = await setFavoriteUsersById(
			ourId,
			socketPayload.userid
		);

		socketIO.to(socketId).emit("set_favoriteusers", favoriteusers);
	} catch (error) {
		console.log("set_favoriteusers error", error);
	}
}

export async function socketSetBannedUserHandler(
	socketIO: any,
	socketPayload: IQueryBannedUser,
	socketId: string
) {
	try {
		const ourId = getUserIdFromSocketTable(sockets, socketId);

		const bannedusers = await setBannedUsersById(
			ourId,
			socketPayload.userid
		);

		socketIO.to(socketId).emit("set_bannedusers", bannedusers);
	} catch (error) {
		console.log("set_bannedusers error", error);
	}
}

export async function socketClosedHandler(socketId: string) {
	const userIndex = sockets.findIndex(
		(socketUser) => socketUser.socketid === socketId
	);

	if (userIndex === -1) return;

	setVisitById(socketId, sockets[userIndex].userid, SOCKET_TYPE_OC.closed);

	sockets.splice(userIndex, 1);
}
