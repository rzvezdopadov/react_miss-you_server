import { ACCTYPE } from "../../role/role";
import { IPaid } from "../shop/paid/ipaid";

export interface ICoordinates {
	ipaddress: string;
	latitude: number;
	longitude: number;
}

export interface IPresent {
	fromuserid: string;
	fromname: string;
	presentid: string;
	link: string;
}

export interface IAchivment {
	id: string;
	title: string;
	discription: string;
	link: string;
}

export interface IProfile {
	userid: string;
	timecode: number;
	name: string;
	location: string;
	phone: string;
	guests: string[];
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
	rating: number;
	stickerpacks: string[];
	cash: number;
	acctype: ACCTYPE;
	paid: IPaid;
	deleteacc: number;
	referral: string;
}

export interface IProfileShortBase {
	userid: string;
	timecode: number;
	name: string;
	birthday: number;
	monthofbirth: number;
	yearofbirth: number;
	gender: number;
	photomain: number;
	photolink: string[];
	interests: string[];
	rating: number;
}

export interface IProfileShortOutput {
	userid: string;
	timecode: number;
	name: string;
	birthday: number;
	monthofbirth: number;
	yearofbirth: number;
	gender: number;
	photolink: string;
	interests: string[];
	rating: number;
}

export interface IFilterUsers {
	location: string;
	agestart: number;
	ageend: number;
	growthstart: number;
	growthend: number;
	weight: number;
	signzodiac: number;
	goaldate: number;
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

export interface IProfileShortForDialog {
	userid: string;
	name: string;
	birthday: number;
	monthofbirth: number;
	yearofbirth: number;
	photomain: number;
	photolink: string[];
}
