import { IStatVisit } from "./iprofiles";

export enum ACCTYPE {
	user = "user",
	admin = "admin",
}

export interface IAdminStatVisit {
	userid: string;
	visit: IStatVisit[];
}

export interface IAdminBanned {
	timecode: number;
	whobanned: string;
	discription: string;
}

export interface IAdminFilterUsers {
	userid: string;
	location: string;
	agestart: number;
	ageend: number;
	growthstart: number;
	growthend: number;
	weight: number;
	signzodiac: number;
	gender: number;
	gendervapor: number;
	education: number;
	fieldofactivity: number;
	maritalstatus: number;
	children: number;
	religion: number;
	smoke: number;
	alcohol: number;
	profit: number;
	acctype: ACCTYPE;
	interests: Array<string>;
}

export interface IQueryGetAdminProfiles {
	startcount: number;
	amount: number;
	filters: IAdminFilterUsers;
}

export interface IQuerySetAdminBanned {
	userid: string;
	minute: number;
	hour: number;
	month: number;
	discription: string;
}
