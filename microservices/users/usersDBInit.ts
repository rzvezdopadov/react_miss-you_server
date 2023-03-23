import {
	data_age,
	data_alcohol,
	data_children,
	data_education,
	data_fieldOfActivity,
	data_gender,
	data_genderVapor,
	data_growth,
	data_iDontLikeСharacter,
	data_iLikeСharacter,
	data_location,
	data_maritalStatus,
	data_profit,
	data_religion,
	data_smoke,
	data_weight,
} from "../profile/profileData";
import { ACCTYPE } from "../admin/iadmin";
import { IProfileRegistration } from "../auth/iauth";
import { poolDB } from "../../db/config";
import {
	TIMECODE_DAY,
	TIMECODE_NONTH,
	getTimecodeNow,
} from "../../utils/datetime";
import { getSignZodiac } from "../../utils/signzodiac";
import { getRandomInteger, getUniqueIntegerArr } from "../../utils/random";
import {
	fakeNamesMan,
	fakeNamesWoman,
	fakeSurnames,
	fakeUsersHello,
	fakeUsersMan,
	fakeUsersWoman,
	interests,
} from "./usersData";

const config = require("config");
const bcrypt = require("bcryptjs");

const fakeUsersGenerate = async (
	fakeUserCount: number
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
			favoriteusers: [],
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
				messagewrite: { enabled: false, timecode: 0 },
				messageread: { enabled: false, timecode: 0 },
				longfilters: { enabled: false, timecode: 0 },
				filtersvapors: { enabled: false, timecode: 0 },
				longfiltersvapors: { enabled: false, timecode: 0 },
				filtersfavoriteusers: { enabled: false, timecode: 0 },
				longfilterfavoriteusers: { enabled: false, timecode: 0 },
				photofull: { enabled: false, timecode: 0 },
				photoload10: { enabled: false, timecode: 0 },
				photoload15: { enabled: false, timecode: 0 },
				photoload20: { enabled: false, timecode: 0 },
				photoload25: { enabled: false, timecode: 0 },
				photoload30: { enabled: false, timecode: 0 },
				interests20: { enabled: false, timecode: 0 },
				interests30: { enabled: false, timecode: 0 },
				historymessages20: { enabled: false, timecode: 0 },
				historymessages40: { enabled: false, timecode: 0 },
				historymessages60: { enabled: false, timecode: 0 },
				historymessages80: { enabled: false, timecode: 0 },
				historymessages100: { enabled: false, timecode: 0 },
				historymessages150: { enabled: false, timecode: 0 },
				historymessages200: { enabled: false, timecode: 0 },
				historymessages300: { enabled: false, timecode: 0 },
			},
			stickerpacks: [],
			referral: "",
		};

		fakePerson.signzodiac = getSignZodiac(
			fakePerson.birthday,
			fakePerson.monthofbirth
		);
		// added admin how is first user
		arrFakeUsers.push(JSON.parse(JSON.stringify(fakePerson)));
		// added more users

		fakePerson.password = hashedPasswordFakeUser;
		fakePerson.acctype = ACCTYPE.user;

		for (let i = 1; i < fakeUserCount; i++) {
			fakePerson.email = `${i}@gmail.com`;
			fakePerson.userid = `${i}`;

			fakePerson.registrationdate =
				timecodeNow -
				getRandomInteger(TIMECODE_DAY, TIMECODE_DAY * 100);
			fakePerson.timecode =
				fakePerson.registrationdate + getRandomInteger(0, TIMECODE_DAY);

			fakePerson.gender = getRandomInteger(0, data_gender.length - 1);

			const newFakeSurnames =
				fakeSurnames[getRandomInteger(0, fakeSurnames.length - 1)];
			if (fakePerson.gender) {
				fakePerson.name = `${
					fakeNamesWoman[
						getRandomInteger(0, fakeNamesWoman.length - 1)
					]
				} ${newFakeSurnames}`;
			} else {
				fakePerson.name = `${
					fakeNamesMan[getRandomInteger(0, fakeNamesMan.length - 1)]
				} ${newFakeSurnames}`;
			}
			fakePerson.likes = getUniqueIntegerArr(
				1,
				fakeUserCount - 1,
				(fakeUserCount - 1) / 10
			).map((value) => String(value));
			fakePerson.birthday = getRandomInteger(1, 28);
			fakePerson.monthofbirth = getRandomInteger(1, 12);
			fakePerson.yearofbirth = getRandomInteger(1960, 2005);
			fakePerson.growth = getRandomInteger(
				data_growth[0],
				data_growth[data_growth.length - 1]
			);
			fakePerson.weight = getRandomInteger(0, data_weight.length - 1);
			fakePerson.gendervapor = getRandomInteger(
				0,
				data_genderVapor.length - 1
			);
			if (fakePerson.gender) {
				fakePerson.photolink = getUniqueIntegerArr(
					0,
					fakeUsersWoman.length - 1,
					getRandomInteger(0, 10)
				).map((value) => fakeUsersWoman[value]);
			} else {
				fakePerson.photolink = getUniqueIntegerArr(
					0,
					fakeUsersMan.length - 1,
					getRandomInteger(0, 10)
				).map((value) => fakeUsersMan[value]);
			}
			fakePerson.photomain = getRandomInteger(
				0,
				fakePerson.photolink.length - 1
			);
			fakePerson.signzodiac = getSignZodiac(
				fakePerson.birthday,
				fakePerson.monthofbirth
			);
			fakePerson.education = getRandomInteger(
				0,
				data_education.length - 1
			);
			fakePerson.fieldofactivity = getRandomInteger(
				0,
				data_fieldOfActivity.length - 1
			);
			fakePerson.maritalstatus = getRandomInteger(
				0,
				data_maritalStatus.length - 1
			);
			fakePerson.children = getRandomInteger(0, data_children.length - 1);
			fakePerson.religion = getRandomInteger(0, data_religion.length - 1);
			fakePerson.smoke = getRandomInteger(0, data_smoke.length - 1);
			fakePerson.alcohol = getRandomInteger(0, data_alcohol.length - 1);
			fakePerson.discription =
				fakeUsersHello[getRandomInteger(0, fakeUsersHello.length - 1)] +
				", меня зовут " +
				fakePerson.name;
			fakePerson.profit = getRandomInteger(0, data_profit.length - 1);
			fakePerson.interests = getUniqueIntegerArr(
				0,
				interests.length - 1,
				getRandomInteger(0, 10)
			).map((value) => interests[value]);
			fakePerson.ilikecharacter = getUniqueIntegerArr(
				0,
				data_iLikeСharacter.length - 1,
				getRandomInteger(0, 10)
			);
			fakePerson.idontlikecharacter = getUniqueIntegerArr(
				0,
				data_iDontLikeСharacter.length - 1,
				getRandomInteger(0, 10)
			);
			fakePerson.rating = getRandomInteger(0, 10000);
			fakePerson.cash = getRandomInteger(1000, 10000);
			fakePerson.referral = String(
				getRandomInteger(1, fakeUserCount - 1)
			);

			fakePerson.paid.messagewrite.enabled = true;
			fakePerson.paid.messagewrite.timecode =
				fakePerson.registrationdate + TIMECODE_NONTH;

			arrFakeUsers.push(JSON.parse(JSON.stringify(fakePerson)));
		}
	} catch (error) {
		console.log("fakeUsersGenerate", error);
	}

	return arrFakeUsers;
};

function arrQueryInt(arr) {
	let str = "";

	if (arr.length === 0) {
		str += "ARRAY [] ::INTEGER []";
	} else {
		str += "ARRAY [";

		for (let i = 0; i < arr.length; i++) str += "" + arr[i] + ", ";

		str = str.slice(0, -2);
		str += "]";
	}

	return str;
}

function arrQueryStr(arr) {
	let str = "";

	if (arr.length === 0) {
		str += "ARRAY [] ::TEXT []";
	} else {
		str += "ARRAY [";

		for (let i = 0; i < arr.length; i++) str += "'" + arr[i] + "', ";

		str = str.slice(0, -2);
		str += "]";
	}

	return str;
}

const fakeQueryStringUsersGenerate = async (
	fakeUserCount: number
): Promise<string[]> => {
	let fakeQueryUsers: string[] = [];

	try {
		const fakeUsers = await fakeUsersGenerate(fakeUserCount);

		fakeQueryUsers = fakeUsers.map((fakeUser) => {
			const strQuery =
				"INSERT INTO users (" +
				"email, password, jwt, " +
				"userid, coordinates, registrationdate, " +
				"timecode, name, location, likes, favoriteusers," +
				"birthday, monthofbirth, yearofbirth, " +
				"growth, weight, " +
				"gender, gendervapor, " +
				"photomain, photolink, " +
				"signzodiac, education, " +
				"fieldofactivity, maritalstatus, " +
				"children, religion, " +
				"smoke, alcohol, " +
				"discription, profit, " +
				"interests, " +
				"filters, " +
				"ilikecharacter, idontlikecharacter, " +
				"stickerpacks, " +
				"rating, cash, acctype, " +
				"banned, " +
				"visit, paid, referral" +
				") VALUES (" +
				`'${fakeUser.email}', '${fakeUser.password}', ARRAY [] :: JSON [], ` +
				`'${fakeUser.userid}', ARRAY [] :: JSON[], ${fakeUser.registrationdate}, ` +
				`${fakeUser.timecode}, '${fakeUser.name}', '${fakeUser.location}', ` +
				`${arrQueryStr(fakeUser.likes)}, ${arrQueryStr(
					fakeUser.favoriteusers
				)}, ` +
				`${fakeUser.birthday}, ${fakeUser.monthofbirth}, ${fakeUser.yearofbirth}, ` +
				`${fakeUser.growth}, ${fakeUser.weight}, ` +
				`${fakeUser.gender}, ${fakeUser.gendervapor}, ` +
				`${fakeUser.photomain}, ${arrQueryStr(fakeUser.photolink)}, ` +
				`${fakeUser.signzodiac}, ${fakeUser.education}, ` +
				`${fakeUser.fieldofactivity}, ${fakeUser.maritalstatus}, ` +
				`${fakeUser.children}, ${fakeUser.religion}, ` +
				`${fakeUser.smoke}, ${fakeUser.alcohol}, ` +
				`'${fakeUser.discription}', ${fakeUser.profit}, ` +
				`${arrQueryStr(fakeUser.interests)}, ` +
				`'${JSON.stringify(fakeUser.filters)}' :: JSON, ` +
				`${arrQueryInt(fakeUser.ilikecharacter)}, ${arrQueryInt(
					fakeUser.idontlikecharacter
				)}, ` +
				`ARRAY [] :: TEXT [], ` +
				`${fakeUser.rating}, ${fakeUser.cash}, '${fakeUser.acctype}', ` +
				`'${JSON.stringify(fakeUser.banned)}' :: JSON, ` +
				`ARRAY [] :: JSON [], '${JSON.stringify(
					fakeUser.paid
				)}' :: JSON, ` +
				`'${fakeUser.referral}'` +
				")";

			return strQuery;
		});
	} catch (error) {
		console.log("fakeQueryStringUsersGenerate", error);
	}

	return fakeQueryUsers;
};

export async function initDBUsers(): Promise<boolean> {
	try {
		let queryStr = `
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
				favoriteusers TEXT[],
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
                paid JSON,
				referral TEXT
            );
        `;

		await poolDB.query(queryStr);

		queryStr = `SELECT * FROM users`;

		const answerDB = await poolDB.query(queryStr);

		if (answerDB.rows.length === 0) {
			let arrFakeUsers: string[] = [];

			if (config.get("server") === "test") {
				arrFakeUsers = await fakeQueryStringUsersGenerate(
					config.get("countFakeUser")
				);
			} else {
				arrFakeUsers = await fakeQueryStringUsersGenerate(0);
			}

			arrFakeUsers.forEach(async (value) => await poolDB.query(value));
		}

		console.log("initDB Users Ok!");
		return true;
	} catch (error) {
		console.log("initDB Users Error:", error);
		return false;
	}
}
