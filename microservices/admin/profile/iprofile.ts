import { ICoordinates, IFilterUsers } from "../../user/profile/iprofile";
import { ACCTYPE } from "../../role/role";

import { IStatVisit } from "../statistics/istatistics";
import { IPaid } from "../../user/shop/paid/ipaid";

export interface IAdminStatVisit {
	userid: string;
	visit: IStatVisit[];
}

export interface IAdminBanned {
	timecode: number;
	whobanned: string;
	discription: string;
}

export interface IAdminUserProfile {
	email: string;
	userid: string;
	coordinates: ICoordinates[];
	registrationdate: number;
	likes: string[];
	visit: IStatVisit[];
	banned: IAdminBanned;
	paid: IPaid;
}

export interface IAdminFilterUsers extends IFilterUsers {
	userid: string;
	gender: number;
	acctype: ACCTYPE;
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

export interface IQueryDeleteAdminPhoto {
	userid: string;
	photoPos: number;
}
