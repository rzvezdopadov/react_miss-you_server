import { IAdminBanned } from "../../admin/profile/iprofile";
import { IStatVisit } from "../../admin/statistics/istatistics";
import { IProfile, ICoordinates } from "../../user/profile/iprofile";

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
	coordinates: ICoordinates[];
	registrationdate: number;
	visit: IStatVisit[];
	banned: IAdminBanned;
	referral: string;
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
