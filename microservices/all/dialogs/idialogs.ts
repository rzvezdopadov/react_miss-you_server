export enum MESSAGETYPE {
	message,
	sticker,
}

export interface IMessage {
	userid: string;
	timecode: number;
	type: MESSAGETYPE;
	userid1del: boolean;
	userid2del: boolean;
	userid1rd: boolean;
	userid2rd: boolean;
	message: string;
	stickerpackid: string;
	stickerpos: number;
}

export interface IQuerySendMessage {
	userid: string;
	message: string;
}

export interface IQuerySendSticker {
	userid: string;
	stickerpackid: string;
	stickerpos: number;
}

export interface IDialogBase {
	userid1: string;
	userid2: string;
	timecode: number;
	dck: string;
	messages: IMessage[];
}

export interface IDialogOutput {
	timecode: number;
	userid: string;
	name: string;
	birthday: number;
	monthofbirth: number;
	yearofbirth: number;
	photolink: string;
	messages: IMessage[];
}
