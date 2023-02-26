import { COMPLAINTSTATUS } from "./iadmin";
import { IMessage } from "./idialogs";

export interface IComplaintBase {
	userfrom: string;
	userto: string;
	timecode: number;
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
	photomain: number;
	photolink: string[];
	status: COMPLAINTSTATUS;
	messages: IMessage[];
	complmessages: IMessage[];
}
