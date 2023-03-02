import { data_age, data_growth, data_location } from "../data/profiles";
import { ACCTYPE } from "../interfaces/iadmin";
import { IProfileRegistration } from "../interfaces/iauth";
import { poolDB } from "../query/config";
import { getTimecodeNow } from "../utils/datetime";
import { getSignZodiac } from "../utils/profile";

const config = require("config");
const bcrypt = require("bcryptjs");

const fakeUsersGenerate = async (
	countFakeUser: number
): Promise<IProfileRegistration[]> => {
	const arrFakeUsers: IProfileRegistration[] = [];

	try {
		const timecodeNow = getTimecodeNow();

		const hashedPasswordAdmin = await bcrypt.hash(
			config.get("defaultPassAdmin"),
			config.get("saltpass")
		);

		const hashedPasswordFakeUser = await bcrypt.hash(
			config.get("defaultPassFakeUser"),
			config.get("saltpass")
		);

		const fakePerson: IProfileRegistration = {
			email: "admin@gmail.com",
			password: hashedPasswordAdmin,
			jwt: [],
			userid: "admin",
			coordinates: [],
			registrationdate: timecodeNow,
			timecode: timecodeNow,
			name: "Служба поддержки",
			location: data_location[0],
			likes: [],
			birthday: 30,
			monthofbirth: 9,
			yearofbirth: 1990,
			growth: 186,
			weight: 90,
			gender: 0,
			gendervapor: 2,
			photomain: 0,
			photolink: [],
			signzodiac: 0,
			education: 0,
			fieldofactivity: 0,
			maritalstatus: 0,
			children: 0,
			religion: 0,
			smoke: 0,
			alcohol: 0,
			discription:
				"Данный аккаунт принадлежит службе поддержки, вы можете задать любой, интересующий вас вопрос =)",
			profit: 0,
			interests: [],
			ilikecharacter: [],
			idontlikecharacter: [],
			rating: 1000000,
			cash: 1000000,
			filters: {
				location: data_location[0],
				agestart: data_age[0],
				ageend: data_age[data_age.length - 1],
				growthstart: data_growth[0],
				growthend: data_growth[data_growth.length - 1],
				weight: 0,
				signzodiac: 0,
				gendervapor: 2,
				education: 0,
				fieldofactivity: 0,
				maritalstatus: 0,
				children: 0,
				religion: 0,
				smoke: 0,
				alcohol: 0,
				profit: 0,
				interests: [],
			},
			acctype: ACCTYPE.admin,
			visit: [],
			banned: { timecode: 0, whobanned: "", discription: "" },
			paid: {
				messageread: { enabled: false, timecode: 0 },
				longfilters: { enabled: false, timecode: 0 },
				userfavorite: { enabled: false, timecode: 0 },
				photoall: { enabled: false, timecode: 0 },
				photofull: { enabled: false, timecode: 0 },
			},
			stickerpacks: [],
		};

		fakePerson.signzodiac = getSignZodiac(
			fakePerson.birthday,
			fakePerson.monthofbirth
		);

		arrFakeUsers.push(fakePerson);
	} catch (error) {
		console.log("fakeUsersGenerate", error);
	}

	return arrFakeUsers;
};

const fakeQueryStringUsersGenerate = async (
	countFakeUser: number
): Promise<string[]> => {
	const fakeQueryUsers: string[] = [];

	const fakeUsers = await fakeUsersGenerate(countFakeUser);

	return fakeQueryUsers;
};

export async function initDBUsers(): Promise<boolean> {
	try {
		const queryStr = `
            CREATE TABLE IF NOT EXISTS users (
                email TEXT,
                password TEXT,
                jwt JSON[],
                id serial PRIMARY KEY,
                userid TEXT,
                coordinates JSON[],
                registrationdate BIGINT,
                timecode BIGINT,
                name TEXT,
                location TEXT,
                likes TEXT[],
                birthday INT,
                monthofbirth INT,
                yearofbirth INT,
                growth INT,
                weight INT,
                gender INT,
                gendervapor INT,
                photomain INT,
                photolink TEXT[],
                signzodiac INT,
                education INT,
                fieldofactivity INT,
                maritalstatus INT,
                children INT,
                religion INT,
                smoke INT,
                alcohol INT,
                discription TEXT,
                profit INT,
                interests TEXT[],
                filters JSON,
                ilikecharacter INT[],
                idontlikecharacter INT[],
                stickerpacks TEXT[],
                rating INT,
                cash INT,
                acctype TEXT,
                banned JSON, 
                visit JSON[],
                paid JSON
            );
        `;

		await poolDB.query(queryStr);

		fakeQueryStringUsersGenerate(config.get("countFakeUser"));

		console.log("initDB Users Ok!");
		return true;
	} catch (error) {
		console.log("initDB Users Error:", error);
		return false;
	}
}
