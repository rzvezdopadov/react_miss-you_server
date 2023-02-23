import {
	IDialogBase,
	IDialogOutput,
	IMessage,
	MESSAGETYPE,
} from "../interfaces/idialogs";
import {
	getDialogByIdFromDB,
	getDialogsByIdFromDB,
	setDialogByIdToDB,
} from "../query/dialogs";
import { getProfileByIdFromDB, getProfilesForDialogs } from "../query/profile";
import { getTimecodeNow } from "./datetime";

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
		photomain: 0,
		photolink: [],
		messages: [],
	};

	try {
		let dialog = await getDialogByIdFromDB(ourId, userId);

		const newMessageObj: IMessage = {
			userid: ourId,
			timecode: getTimecodeNow(),
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
			dialog.messages.push(newMessageObj);
		} else {
			const newDialogBase: IDialogBase = {
				userid1: ourId,
				userid2: userId,
				timecode: 0,
				dck: "",
				messages: [],
			};

			newDialogBase.messages.push(newMessageObj);
			dialog = newDialogBase;
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
		newDialog.photomain = profileUser.photomain;
		newDialog.photolink = profileUser.photolink;
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
		photomain: 0,
		photolink: [],
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
			photomain: profile.photomain,
			photolink: profile.photolink,
			messages: (dialog && dialog.messages) || [],
		};

		return newDialog;
	} catch (error) {
		console.log("getDialog", error);
		return newDialog;
	}
};

export const getDialogs = async (
	ourId: string
): Promise<Array<IDialogOutput>> => {
	try {
		const dialogs = await getDialogsByIdFromDB(ourId);

		if (!dialogs.length) return [];

		const idUsers = dialogs.map((dialog) =>
			dialog.userid1 === ourId ? dialog.userid2 : dialog.userid1
		);

		const users = await getProfilesForDialogs(idUsers);

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

		let newDialogs: Array<IDialogOutput> = [];

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
					photomain: users[index].photomain,
					photolink: users[index].photolink,
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
