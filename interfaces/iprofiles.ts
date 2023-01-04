export interface IProfile {
	userid: string;
	name: string;
	latitude: number;
	longitude: number;
	location: string;
	likes: Array<string>;
	age: number;
	birthday: number;
	monthofbirth: number;
	yearofbirth: number;
	growth: number;
	weight: number;
	gender: number;
	gendervapor: number;
	photomain: number;
	photolink: Array<string>;
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
	interests: Array<string>;
	ilikecharacter: Array<number>;
	idontlikecharacter: Array<number>;
	raiting: number;
	filters: IFilterUsers;
}

interface IFilterUsers {
	location: string;
	signzodiac: number;
	agestart: number;
	ageend: number;
	growthstart: number;
	growthend: number;
	weight: number;
	gendervapor: number;
	religion: number;
	smoke: number;
	alcohol: number;
	interests: Array<string>;
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
	users: Array<string>;
}

export interface IQueryGetProfile {
	userid: string;
}

export interface IQuerySetProfile {
	profile: IProfile;
}

export interface IRegistration {
	gender: number;
	gendervapor: number;
	name: string;
	email: string;
	password: string;
}

export interface IMessage {
	userid: string;
	timecode: number;
	userid1del: boolean;
	userid2del: boolean;
	message: string;
}

export interface IDialogBase {
	userid1: string;
	userid2: string;
	timecode: number;
	dck: string;
	messages: Array<IMessage>;
}

export interface IDialogOutput {
	timecode: number;
	userid: string;
	name: string;
	age: number;
	photomain: number;
	photolink: Array<string>;
	messages: Array<IMessage>;
}

export interface IProfileForDialog {
	userid: string;
	name: string;
	age: number;
	photomain: number;
	photolink: Array<string>;
}

export interface IQuerySendMessage {
	userid: string;
	message: string;
}

export interface IQueryLike {
	userid: string;
}

export interface IPhotos {
	photolink: Array<string>;
	photomain: number;
}
