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
