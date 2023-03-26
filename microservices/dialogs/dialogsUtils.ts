import {
	getDialogByIdFromDB,
	getDialogsByIdFromDB,
	setDialogByIdToDB,
} from "./dialogsDB";
import {
	getProfileByIdFromDB,
	getProfilesForDialogsFromDB,
} from "../profile/profileDB";
import { getTimecodeNow } from "../../utils/datetime";
import { IDialogBase, IDialogOutput, IMessage, MESSAGETYPE } from "./idialogs";
import { getPaidByIdFromDB } from "../shop/paid/paidDB";

export const setDialog = async (
	ourId: string,
	userId: string,
	type: MESSAGETYPE,
	message: string,
	stickerpackid: string,
	stickerpos: number
): Promise<IDialogOutput> => {
	const newDialog: IDialogOutput = {
		timecode: 0,
		userid: "",
		name: "",
		birthday: 0,
		monthofbirth: 0,
		yearofbirth: 0,
		photolink: "",
		messages: [],
	};

	const timecode = getTimecodeNow();

	try {
		let dialog = await getDialogByIdFromDB(ourId, userId);

		const newMessageObj: IMessage = {
			userid: ourId,
			timecode: timecode,
			type: type,
			userid1del: false,
			userid2del: false,
			userid1rd: false,
			userid2rd: false,
			message: message,
			stickerpackid: stickerpackid,
			stickerpos: stickerpos,
		};

		if (dialog && Object.keys(dialog).length) {
			dialog.messages.unshift(newMessageObj);
		} else {
			const newDialogBase: IDialogBase = {
				userid1: ourId,
				userid2: userId,
				timecode: 0,
				dck: "",
				messages: [],
			};

			newDialogBase.messages.unshift(newMessageObj);
			dialog = newDialogBase;
		}

		const userId1Paid = await getPaidByIdFromDB(ourId);
		const userId2Paid = await getPaidByIdFromDB(userId);

		if (
			userId1Paid.historymessages300.timecode > timecode ||
			userId2Paid.historymessages300.timecode > timecode
		) {
			if (dialog.messages.length > 300) dialog.messages.splice(300);
		} else if (
			userId1Paid.historymessages200.timecode > timecode ||
			userId2Paid.historymessages200.timecode > timecode
		) {
			if (dialog.messages.length > 200) dialog.messages.splice(200);
		} else if (
			userId1Paid.historymessages100.timecode > timecode ||
			userId2Paid.historymessages100.timecode > timecode
		) {
			if (dialog.messages.length > 100) dialog.messages.splice(100);
		} else if (
			userId1Paid.historymessages80.timecode > timecode ||
			userId2Paid.historymessages80.timecode > timecode
		) {
			if (dialog.messages.length > 80) dialog.messages.splice(80);
		} else if (
			userId1Paid.historymessages60.timecode > timecode ||
			userId2Paid.historymessages60.timecode > timecode
		) {
			if (dialog.messages.length > 60) dialog.messages.splice(60);
		} else if (
			userId1Paid.historymessages40.timecode > timecode ||
			userId2Paid.historymessages40.timecode > timecode
		) {
			if (dialog.messages.length > 40) dialog.messages.splice(40);
		} else if (
			userId1Paid.historymessages20.timecode > timecode ||
			userId2Paid.historymessages20.timecode > timecode
		) {
			if (dialog.messages.length > 20) dialog.messages.splice(20);
		} else if (dialog.messages.length > 10) {
			dialog.messages.splice(10);
		}

		await setDialogByIdToDB(dialog);

		const profileUser = await getProfileByIdFromDB(userId);
		const updatesDialog = await getDialogByIdFromDB(ourId, userId);

		newDialog.timecode = updatesDialog.timecode;
		newDialog.userid = userId;
		newDialog.name = profileUser.name;
		newDialog.birthday = profileUser.birthday;
		newDialog.monthofbirth = profileUser.monthofbirth;
		newDialog.yearofbirth = profileUser.yearofbirth;
		newDialog.photolink = profileUser.photolink[profileUser.photomain];
		newDialog.messages = updatesDialog.messages;

		return newDialog;
	} catch (error) {
		console.log("setDialog", error);
		return newDialog;
	}
};

export const getDialog = async (
	ourId: string,
	userId: string
): Promise<IDialogOutput> => {
	const newDialog: IDialogOutput = {
		timecode: 0,
		userid: "",
		name: "",
		birthday: 0,
		monthofbirth: 0,
		yearofbirth: 0,
		photolink: "",
		messages: [],
	};

	try {
		const dialog = await getDialogByIdFromDB(ourId, userId);
		const profile = await getProfileByIdFromDB(userId);

		const newDialog: IDialogOutput = {
			timecode: (dialog && dialog.timecode) || 0,
			userid: userId,
			name: profile.name,
			birthday: profile.birthday,
			monthofbirth: profile.monthofbirth,
			yearofbirth: profile.yearofbirth,
			photolink: profile.photolink[profile.photomain],
			messages: (dialog && dialog.messages) || [],
		};

		return newDialog;
	} catch (error) {
		console.log("getDialog", error);
		return newDialog;
	}
};

export const getDialogs = async (ourId: string): Promise<IDialogOutput[]> => {
	try {
		const dialogs = await getDialogsByIdFromDB(ourId);

		if (!dialogs.length) return [];

		const idUsers = dialogs.map((dialog) =>
			dialog.userid1 === ourId ? dialog.userid2 : dialog.userid1
		);

		const users = await getProfilesForDialogsFromDB(idUsers);

		dialogs.sort((a, b) => {
			const id1 = a.userid1 === ourId ? a.userid2 : a.userid1;
			const id2 = b.userid1 === ourId ? b.userid2 : b.userid1;

			if (id1 > id2) {
				return 1;
			}
			if (id1 < id2) {
				return -1;
			}
			return 0;
		});

		users.sort((a, b) => {
			if (a.userid > b.userid) {
				return 1;
			}

			if (a.userid < b.userid) {
				return -1;
			}

			return 0;
		});

		let newDialogs: IDialogOutput[] = [];

		if (dialogs.length) {
			dialogs.forEach((value, index) => {
				if (
					dialogs[index].userid1 !== users[index].userid &&
					dialogs[index].userid2 !== users[index].userid
				)
					return;

				const newDialog: IDialogOutput = {
					timecode: dialogs[index].timecode,
					userid: users[index].userid,
					name: users[index].name,
					birthday: users[index].birthday,
					monthofbirth: users[index].monthofbirth,
					yearofbirth: users[index].yearofbirth,
					photolink: users[index].photolink[users[index].photomain],
					messages: dialogs[index].messages,
				};

				newDialogs.push(newDialog);
			});

			newDialogs.sort(
				(a, b) =>
					b.messages[b.messages.length - 1].timecode -
					a.messages[a.messages.length - 1].timecode
			);
		} else {
			newDialogs = [];
		}
		return newDialogs;
	} catch (error) {
		console.log("getDialogs", error);
		return [];
	}
};
