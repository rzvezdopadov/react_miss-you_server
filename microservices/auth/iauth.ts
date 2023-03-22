import { IAdminBanned } from "../admin/iadmin";
import { IPaid } from "../shop/ipaid";
import { ICoordinates, IProfile } from "../profile/profile/iprofile";
import { IStatVisit } from "../statistics/istatistics";

export interface IJWT {
	timecode: number;
	token: string;
	ipaddress: string;
	browser: string;
}

export interface IProfileRegistration extends IProfile {
	email: string;
	password: string;
	jwt: IJWT[];
	userid: string;
	coordinates: ICoordinates[];
	registrationdate: number;
	likes: string[];
	favoriteusers: string[];
	visit: IStatVisit[];
	banned: IAdminBanned;
	referral: string;
	paid: IPaid;
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
	referral: string;
	captcha: string;
}

export interface ILogin {
	email: string;
	password: string;
	captcha: string;
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
