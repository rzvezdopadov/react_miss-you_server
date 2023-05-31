import { MESSAGETYPE } from "../dialogs/idialogs";

export enum COMPLAINTTYPE {
	message = "message",
	profile = "profile",
}

export enum COMPLAINTSTATUS {
	open = "open",
	inwork = "inwork",
	close = "close",
}

export interface IComplMessage {
	timecode: number;
	type: MESSAGETYPE;
	userid: string;
	message: string;
	stpid: string;
	spos: number;
}

export interface IComplaintBase {
	userfrom: string;
	userto: string;
	timecode: number;
	type: COMPLAINTTYPE;
	subject: string;
	discription: string;
	dck: string;
	cash: number;
	status: COMPLAINTSTATUS;
	complmessage: IComplMessage;
}

export interface IQuerySendComplaintMessage {
	userid: string;
	userto: string;
	subject: string;
	message: string;
	complmessage: IComplMessage;
}

export interface IQuerySendComplaintMessage {
	userid: string;
	userto: string;
	subject: string;
	stickerpackid: string;
	stickerpos: number;
	complmessage: IComplMessage;
}
