import { COMPLAINTSTATUS } from "../admin/iadmin";
import { IMessage } from "../dialogs/idialogs";

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
	photolink: string;
	status: COMPLAINTSTATUS;
	messages: IMessage[];
	complmessages: IMessage[];
}
