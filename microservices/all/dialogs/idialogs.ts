export enum MESSAGETYPE {
	message,
	sticker,
}

export interface IQueryGetMessages {
	userid: string;
	startcount: number;
	amount: number;
}

export interface IGetMessages {
	ourid: string;
	userid: string;
	startcount: number;
	amount: number;
}

export interface IQueryMessage {
	id1: string;
	id2: string;
	type: MESSAGETYPE;
	msg: string;
	spkid: string;
	spos: number;
}

export interface IMessageOutput {
	timecode: number;
	id1: string;
	id2: string;
	id1rd: boolean;
	id2rd: boolean;
	dck: string;
	type: MESSAGETYPE;
	msg: string;
	spkid: string;
	spos: number;
}

export interface IMessageBase {
	timecode: number;
	id1: string;
	id2: string;
	id1del: boolean;
	id2del: boolean;
	id1rd: boolean;
	id2rd: boolean;
	dck: string;
	type: MESSAGETYPE;
	msg: string;
	spkid: string;
	spos: number;
}

export interface IQuerySendMessage {
	userid: string;
	msg: string;
}

export interface IQuerySendSticker {
	userid: string;
	spkid: string;
	spos: number;
}

export interface IDialogOutput {
	userid: string;
	name: string;
	birthday: number;
	monthofbirth: number;
	yearofbirth: number;
	photolink: string;
	msgs: IMessageOutput[];
}
