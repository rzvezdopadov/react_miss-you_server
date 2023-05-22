import { getTimecodeNow } from "../../utils/datetime";
import {
	getAcctypeByIdFromDB,
	setBannedByIdToDB,
} from "../admin/profile/profileDB";
import { getBannedUsersByIdFromDB } from "../user/bannedusers/bannedusersDB";
import { setBannedUsersById } from "../user/bannedusers/bannedusersUtils";
import { IQueryBannedUser } from "../user/bannedusers/ibannedusers";
import { botPhraseCensure, botPhraseSpam } from "../admin/bots/botsUtils";
import { setDialog } from "../all/dialogs/dialogsUtils";
import {
	IQuerySendMessage,
	IQuerySendSticker,
	MESSAGETYPE,
} from "../all/dialogs/idialogs";
import { IQueryLike } from "../user/likes/ilikes";
import { setLikesById } from "../user/likes/likesUtils";
import { setTimecodeToDB } from "../admin/statistics/statisticsDB";
import { setVisitById } from "../admin/statistics/statisticsUtils";
import { ISocketUsers, SOCKET_TYPE_OC } from "./isocket";
import { getUserIdFromSocketTable, sendToAllSocketsById } from "./socketUtils";
import { testToken } from "../all/auth/token";
import { setFavoriteUsersById } from "../user/favoriteusers/favoriteusersUtils";
import { IQueryFavoriteUser } from "../user/favoriteusers/ifavoriteusers";
import { getPaidByIdFromDB } from "../user/shop/paid/paidDB";
import { IComplaintBase } from "../all/complaints/icomplaints";
import { setComplaint } from "../all/complaints/complaintsUtils";
import { ACCTYPE } from "../role/role";

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
		console.log("socketGetJWTHandler", error);
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

		const acctype = await getAcctypeByIdFromDB(ourId);

		if (acctype !== ACCTYPE.admin) {
			const testBotSpam = botPhraseSpam(socketPayload.message);
			if (testBotSpam.enabled) {
				setBannedByIdToDB(ourId, {
					timecode: testBotSpam.timecode,
					whobanned: testBotSpam.whobanned,
					discription: testBotSpam.discription,
				});
				socketIO.to(socketId).emit("delete_jwt");

				return;
			}

			const testBotCensure = botPhraseCensure(socketPayload.message);
			if (testBotCensure.enabled) {
				setBannedByIdToDB(ourId, {
					timecode: testBotCensure.timecode,
					whobanned: testBotCensure.whobanned,
					discription: testBotCensure.discription,
				});
				socketIO.to(socketId).emit("delete_jwt");

				return;
			}

			const paid = await getPaidByIdFromDB(ourId);
			if (paid.messageswrite.timecode < getTimecodeNow()) {
				sendToAllSocketsById(
					socketIO,
					sockets,
					[ourId],
					"modalmessage",
					{
						message:
							"У вас закончилась возможность писать сообщения, приобретите данную опцию в магазине!",
					}
				);

				return;
			}

			const bannedusers = await getBannedUsersByIdFromDB(
				socketPayload.userid
			);
			if (bannedusers.includes(ourId)) {
				sendToAllSocketsById(
					socketIO,
					sockets,
					[ourId],
					"modalmessage",
					{
						message:
							"Вы не можете написать данному пользователю, вы у него в бан листе!",
					}
				);

				return;
			}
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
		console.log("socketMessageHandler", error);
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

		const acctype = await getAcctypeByIdFromDB(ourId);

		if (acctype !== ACCTYPE.admin) {
			const paid = await getPaidByIdFromDB(ourId);
			if (paid.messageswrite.timecode < getTimecodeNow()) {
				sendToAllSocketsById(
					socketIO,
					sockets,
					[ourId],
					"modalmessage",
					{
						message:
							"У вас закончилась возможность писать сообщения, приобретите данную опцию в магазине!",
					}
				);

				return;
			}

			const bannedusers = await getBannedUsersByIdFromDB(
				socketPayload.userid
			);
			if (bannedusers.includes(ourId)) {
				sendToAllSocketsById(
					socketIO,
					sockets,
					[ourId],
					"modalmessage",
					{
						message:
							"Вы не можете написать данному пользователю, вы у него в бан листе!",
					}
				);

				return;
			}
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
		console.log("socketStickerHandler", error);
	}
}

export async function socketComplaintProfileHandler(
	socketIO: any,
	socketPayload: IComplaintBase,
	socketId: string
) {
	try {
		const ourId = getUserIdFromSocketTable(sockets, socketId);

		if (!(ourId && socketPayload.userto)) return;
		if (ourId === socketPayload.userto) return;

		if (!socketPayload.subject || !socketPayload.discription) {
			sendToAllSocketsById(socketIO, sockets, [ourId], "modalmessage", {
				message:
					"Тема и описание должно быть обязательно указанно в жалобе!",
			});
			return;
		}

		socketPayload.userfrom = ourId;

		const complaint = await setComplaint(socketPayload);

		if (!complaint) {
			sendToAllSocketsById(socketIO, sockets, [ourId], "modalmessage", {
				message:
					"К сожалению жалоба не отправленна, возможно запрос неверный!",
			});
			return;
		}

		sendToAllSocketsById(socketIO, sockets, [ourId], "modalmessage", {
			message: "Жалоба успешно отправленна!",
		});
	} catch (error) {
		console.log("socketComplaintProfileMessageHandler", error);
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
		console.log("socketSetLikeHandler", error);
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
		console.log("socketSetFavoriteUserHandler", error);
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
		console.log("socketSetBannedUserHandler", error);
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
