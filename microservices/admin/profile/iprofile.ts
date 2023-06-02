import {
	IAchivment,
	ICoordinates,
	IFilterUsers,
	IPresent,
} from "../../user/profile/iprofile";
import { ACCTYPE } from "../../role/role";

import { IStatVisit } from "../statistics/istatistics";
import { IPaid } from "../../user/shop/paid/ipaid";

export interface IAdminBanned {
	timecode: number;
	whobanned: string;
	discription: string;
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

export interface IAdminProfile {
	userid: string;
	email: string;
	coordinates: ICoordinates;
	registrationdate: number;
	timecode: number;
	name: string;
	location: string;
	phone: string;
	likes: string[];
	favoriteusers: string[];
	privateselections: string[];
	bannedusers: string[];
	presents: IPresent[];
	achivments: IAchivment[];
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
	goaldate: number;
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
	stickerpacks: string[];
	rating: number;
	cash: number;
	acctype: ACCTYPE;
	visit: IStatVisit[];
	paid: IPaid;
	referral: string;
	deleteacc: number;
}
