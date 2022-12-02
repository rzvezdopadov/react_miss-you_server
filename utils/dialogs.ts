import { IDialogBase, IDialogOutput, IMessage } from "../interfaces/iprofiles";
import {
	getDialogByIdFromDB,
	getDialogsByIdFromDB,
	setDialogByIdToDB,
} from "../query/dialogs";
import { getProfileByIdFromDB, getProfilesForDialogs } from "../query/profile";
import { getTimecodeNow } from "./datetime";

export const setDialog = async (
	ourId: number,
	userId: number,
	message: string
): Promise<IDialogOutput> => {
	const newDialog: IDialogOutput = {
		timecode: 0,
		userId: 0,
		name: "",
		age: 0,
		photomain: 0,
		photolink: [],
		messages: [],
	};

	try {
		let dialog = await getDialogByIdFromDB(ourId, userId);

		const newMessageObj: IMessage = {
			userId: ourId,
			timecode: getTimecodeNow(),
			id1del: false,
			id2del: false,
			message: message,
		};

		if (dialog && Object.keys(dialog).length) {
			dialog.messages.push(newMessageObj);
		} else {
			const newDialogBase: IDialogBase = {
				id: 0,
				id1: ourId,
				id2: userId,
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
		newDialog.userId = userId;
		newDialog.name = profileUser.name;
		newDialog.age = profileUser.age;
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
	ourId: number,
	userId: number
): Promise<IDialogOutput> => {
	const newDialog: IDialogOutput = {
		timecode: 0,
		userId: 0,
		name: "",
		age: 0,
		photomain: 0,
		photolink: [],
		messages: [],
	};

	try {
		const dialog = await getDialogByIdFromDB(ourId, userId);
		const profile = await getProfileByIdFromDB(userId);

		const newDialog: IDialogOutput = {
			timecode: (dialog && dialog.timecode) || 0,
			userId: userId,
			name: profile.name,
			age: profile.age,
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
	ourId: number
): Promise<Array<IDialogOutput>> => {
	try {
		const dialogs = await getDialogsByIdFromDB(ourId);

		if (!dialogs.length) return [];

		const idUsers = dialogs.map((dialog) =>
			dialog.id1 === ourId ? dialog.id2 : dialog.id1
		);

		const users = await getProfilesForDialogs(idUsers);

		dialogs.sort((a, b) => {
			const id1 = a.id1 === ourId ? a.id2 : a.id1;
			const id2 = b.id1 === ourId ? b.id2 : b.id1;

			return id1 - id2;
		});

		users.sort((a, b) => a.id - b.id);

		let newDialogs: Array<IDialogOutput> = [];

		if (dialogs.length) {
			dialogs.forEach((value, index) => {
				const newDialog: IDialogOutput = {
					timecode: dialogs[index].timecode,
					userId: users[index].id,
					name: users[index].name,
					age: users[index].age,
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
