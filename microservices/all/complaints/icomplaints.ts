import { IMessage } from "../dialogs/idialogs";

export enum COMPLAINTTYPE {
	message = "message",
	profile = "profile",
}

export enum COMPLAINTSTATUS {
	open = "open",
	inwork = "inwork",
	close = "close",
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
	complmessage: IMessage;
}

export interface IQuerySendComplaintMessage {
	userid: string;
	userto: string;
	subject: string;
	message: string;
	complaintmessage: IMessage;
}

export interface IQuerySendComplaintMessage {
	userid: string;
	userto: string;
	subject: string;
	stickerpackid: string;
	stickerpos: number;
	complaintmessage: IMessage;
}
