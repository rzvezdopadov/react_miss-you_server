export interface IProfile {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	location: string;
	likes: Array<number>;
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
	weightstart: number;
	weightend: number;
	gendervapor: number;
	religion: number;
	smoke: number;
	alcohol: number;
	interests: Array<string>;
}

export interface IQueryGetProfiles {
	jwt: string;
	id: number;
	startcount: number;
	amount: number;
	filters: IFilterUsers;
	users: string;
}

export interface IGetProfiles {
	jwt: string;
	id: number;
	startcount: number;
	amount: number;
	filters: IFilterUsers;
	users: Array<number>;
}

export interface IQueryGetProfile {
	jwt: string;
	id: number;
}

export interface IQuerySetProfile {
	jwt: string;
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
	userId: number;
	timecode: number;
	id1del: boolean;
	id2del: boolean;
	message: string;
}

export interface IDialogBase {
	id: number;
	id1: number;
	id2: number;
	timecode: number;
	dck: string;
	messages: Array<IMessage>;
}

export interface IDialogOutput {
	timecode: number;
	userId: number;
	name: string;
	age: number;
	photomain: number;
	photolink: Array<string>;
	messages: Array<IMessage>;
}

export interface IProfileForDialog {
	id: number;
	name: string;
	age: number;
	photomain: number;
	photolink: Array<string>;
}

export interface IQuerySendMessage {
	id: number;
	message: string;
}

export interface IQueryLike {
	id: number;
}

export interface IPhotos {
	photolink: Array<string>;
	photomain: number;
}
