import {
	getMessagesByIdFromDB,
	getDialogsByIdFromDB,
	setMessageByIdToDB,
} from "./dialogsDB";
import {
	getProfileByIdFromDB,
	getProfilesForDialogsFromDB,
} from "../../user/profile/profileDB";
import { getTimecodeNow } from "../../../utils/datetime";
import {
	IDialogOutput,
	IGetMessages,
	IMessageOutput,
	IQueryMessage,
	MESSAGETYPE,
} from "./idialogs";
import { getPaidByIdFromDB } from "../../user/shop/paid/paidDB";

export const setMessage = async (
	queryMessage: IQueryMessage
): Promise<IMessageOutput> => {
	try {
		// const userId1Paid = await getPaidByIdFromDB(ourId);
		// const userId2Paid = await getPaidByIdFromDB(userId);

		// if (
		// 	userId1Paid.historymessages300.timecode > timecode ||
		// 	userId2Paid.historymessages300.timecode > timecode
		// ) {
		// 	if (dialog.messages.length > 300) dialog.messages.splice(300);
		// } else if (
		// 	userId1Paid.historymessages200.timecode > timecode ||
		// 	userId2Paid.historymessages200.timecode > timecode
		// ) {
		// 	if (dialog.messages.length > 200) dialog.messages.splice(200);
		// } else if (
		// 	userId1Paid.historymessages100.timecode > timecode ||
		// 	userId2Paid.historymessages100.timecode > timecode
		// ) {
		// 	if (dialog.messages.length > 100) dialog.messages.splice(100);
		// } else if (
		// 	userId1Paid.historymessages80.timecode > timecode ||
		// 	userId2Paid.historymessages80.timecode > timecode
		// ) {
		// 	if (dialog.messages.length > 80) dialog.messages.splice(80);
		// } else if (
		// 	userId1Paid.historymessages60.timecode > timecode ||
		// 	userId2Paid.historymessages60.timecode > timecode
		// ) {
		// 	if (dialog.messages.length > 60) dialog.messages.splice(60);
		// } else if (
		// 	userId1Paid.historymessages40.timecode > timecode ||
		// 	userId2Paid.historymessages40.timecode > timecode
		// ) {
		// 	if (dialog.messages.length > 40) dialog.messages.splice(40);
		// } else if (
		// 	userId1Paid.historymessages20.timecode > timecode ||
		// 	userId2Paid.historymessages20.timecode > timecode
		// ) {
		// 	if (dialog.messages.length > 20) dialog.messages.splice(20);
		// } else if (dialog.messages.length > 10) {
		// 	dialog.messages.splice(10);
		// }

		const newMessage = await setMessageByIdToDB(queryMessage);
		if (!newMessage) return undefined;

		return newMessage;
	} catch (error) {
		console.log("setDialog", error);
		return undefined;
	}
};

export const getDialog = async (
	getMessages: IGetMessages
): Promise<IDialogOutput> => {
	const newDialog: IDialogOutput = {
		userid: "",
		name: "",
		birthday: 0,
		monthofbirth: 0,
		yearofbirth: 0,
		photolink: "",
		msgs: [],
	};

	try {
		const msgs = await getMessagesByIdFromDB(getMessages);
		const profile = await getProfileByIdFromDB(getMessages.userid);

		const newDialog: IDialogOutput = {
			userid: getMessages.userid,
			name: profile.name,
			birthday: profile.birthday,
			monthofbirth: profile.monthofbirth,
			yearofbirth: profile.yearofbirth,
			photolink: profile.photolink[profile.photomain],
			msgs: msgs || [],
		};

		return newDialog;
	} catch (error) {
		console.log("getDialog", error);
		return newDialog;
	}
};

export const getDialogs = async (ourId: string): Promise<string[]> => {
	try {
		const dialogs = await getDialogsByIdFromDB(ourId);

		return dialogs;
	} catch (error) {
		console.log("getDialogs", error);
		return [];
	}
};
