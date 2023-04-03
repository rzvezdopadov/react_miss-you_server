import { IMessage } from "../dialogs/idialogs";

export enum COMPLAINTSTATUS {
	open = "open",
	inwork = "inwork",
	close = "close",
}

export interface IComplaintBase {
	userfrom: string;
	userto: string;
	timecode: number;
	subject: string;
	dck: string;
	status: COMPLAINTSTATUS;
	messages: IMessage[];
	complmessages: IMessage[];
}

export interface IComplaintOutput {
	timecode: number;
	userid: string;
	userto: string;
	name: string;
	birthday: number;
	monthofbirth: number;
	yearofbirth: number;
	photolink: string;
	subject: string;
	status: COMPLAINTSTATUS;
	messages: IMessage[];
	complmessages: IMessage[];
}
