import { IAdminBanned } from "./iadmin";
import { IPaid } from "./ipaid";
import { ICoordinates, IProfile } from "./iprofiles";
import { IStatVisit } from "./istatistics";

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
