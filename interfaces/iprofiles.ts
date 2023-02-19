import { ACCTYPE, IAdminBanned } from "./iadmin";

export interface ICoordinates {
	ipaddress: string;
	latitude: number;
	longitude: number;
}

export interface IJWT {
	timecode: number;
	token: string;
	ipaddress: string;
	browser: string;
}

export interface IProfile {
	userid: string;
	timecode: number;
	name: string;
	location: string;
	likes: string[];
	birthday: number;
	monthofbirth: number;
	yearofbirth: number;
	growth: number;
	weight: number;
	gender: number;
	gendervapor: number;
	photomain: number;
	photolink: string[];
	signzodiac: number;
	education: number;
	fieldofactivity: number;
	maritalstatus: number;
	children: number;
	religion: number;
	smoke: number;
	alcohol: number;
	discription: string;
	profit: number;
	interests: string[];
	filters: IFilterUsers;
	ilikecharacter: number[];
	idontlikecharacter: number[];
	rating: number;
	stickerpacks: string[];
	cash: number;
	acctype: ACCTYPE;
}

export interface IProfileRegistration extends IProfile {
	email: string;
	password: string;
	jwt: IJWT[];
	userid: string;
	coordinates: ICoordinates[];
	registrationdate: number;
	likes: string[];
	visit: IStatVisit[];
	banned: IAdminBanned;
	paid: IPaid;
}

export interface IFilterUsers {
	location: string;
	agestart: number;
	ageend: number;
	growthstart: number;
	growthend: number;
	weight: number;
	signzodiac: number;
	gendervapor: number;
	education: number;
	fieldofactivity: number;
	maritalstatus: number;
	children: number;
	religion: number;
	smoke: number;
	alcohol: number;
	profit: number;
	interests: string[];
}

export interface IQueryGetProfiles {
	userid: string;
	startcount: number;
	amount: number;
	filters: IFilterUsers;
	users: string;
}

export interface IGetProfiles {
	userid: string;
	startcount: number;
	amount: number;
	filters: IFilterUsers;
	users: string[];
}

export interface IQueryGetProfile {
	userid: string;
}

export interface IQuerySetProfile {
	profile: IProfile;
}

export interface IRegistration {
	name: string;
	location: string;
	birthday: number;
	monthofbirth: number;
	yearofbirth: number;
	gender: number;
	gendervapor: number;
	growth: number;
	email: string;
	password: string;
	captcha: string;
}

export interface ILogin {
	email: string;
	password: string;
	captcha: string;
}

export enum messageType {
	message,
	sticker,
}

export interface IMessage {
	userid: string;
	timecode: number;
	type: messageType;
	userid1del: boolean;
	userid2del: boolean;
	userid1rd: boolean;
	userid2rd: boolean;
	message: string;
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
	photomain: number;
	photolink: string[];
	messages: IMessage[];
}

export interface IProfileForDialog {
	userid: string;
	name: string;
	birthday: number;
	monthofbirth: number;
	yearofbirth: number;
	photomain: number;
	photolink: string[];
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

export interface IQueryLike {
	userid: string;
}

export interface IPhotos {
	photolink: string[];
	photomain: number;
}

export interface IStatVisit {
	key: string;
	tco: number;
	tcc: number;
}

export interface IStatisticsVisit {
	userid: string;
	visit: IStatVisit[];
}

export interface IChangePass {
	passwordnow: string;
	passwordnew: string;
	captcha: string;
}

export interface IRecoveryPass {
	email: string;
	captcha: string;
}

export interface ISticker {
	position: number;
	associate: string;
	link: string;
}

export interface IStickerpack {
	idstickerpack: string;
	name: string;
	discription: string;
	price: number;
	author: string;
	stickers: ISticker[];
}

export interface IPaid {
	messageread: false;
}
