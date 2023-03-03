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
} from "../data/profiles";
import { ACCTYPE } from "../interfaces/iadmin";
import { IProfileRegistration } from "../interfaces/iauth";
import { poolDB } from "../query/config";
import { getTimecodeNow } from "../utils/datetime";
import { getSignZodiac } from "../utils/profile";
import { getRandomInteger, getUniqueIntegerArr } from "../utils/random";
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
		// added admin how is first user
		arrFakeUsers.push(fakePerson);
		// added more users
		const dayTimecode = 24 * 60 * 60 * 1000;

		for (let i = 1; i < countFakeUser; i++) {
			const newFakePerson: IProfileRegistration = JSON.parse(
				JSON.stringify(fakePerson)
			);
			newFakePerson.email = `${i}@gmail.com`;
			newFakePerson.userid = `${i}`;
			newFakePerson.password = hashedPasswordFakeUser;
			newFakePerson.registrationdate =
				timecodeNow - getRandomInteger(dayTimecode, dayTimecode * 100);
			newFakePerson.timecode =
				newFakePerson.registrationdate +
				getRandomInteger(0, dayTimecode);

			newFakePerson.gender = getRandomInteger(0, data_gender.length - 1);

			const newFakeSurnames =
				fakeSurnames[getRandomInteger(0, fakeSurnames.length - 1)];
			if (newFakePerson.gender) {
				newFakePerson.name = `${
					fakeNamesWoman[
						getRandomInteger(0, fakeNamesWoman.length - 1)
					]
				} ${newFakeSurnames}`;
			} else {
				newFakePerson.name = `${
					fakeNamesMan[getRandomInteger(0, fakeNamesMan.length - 1)]
				} ${newFakeSurnames}`;
			}
			newFakePerson.likes = getUniqueIntegerArr(
				1,
				countFakeUser - 1,
				countFakeUser - 1 / 10
			).map((value) => String(value));
			newFakePerson.birthday = getRandomInteger(1, 28);
			newFakePerson.monthofbirth = getRandomInteger(1, 12);
			newFakePerson.yearofbirth = getRandomInteger(1960, 2005);
			newFakePerson.growth = getRandomInteger(
				data_growth[0],
				data_growth[data_growth.length - 1]
			);
			newFakePerson.weight = getRandomInteger(0, data_weight.length - 1);
			newFakePerson.gendervapor = getRandomInteger(
				0,
				data_genderVapor.length - 1
			);
			if (newFakePerson.gender) {
				newFakePerson.photolink = getUniqueIntegerArr(
					0,
					fakeUsersWoman.length - 1,
					getRandomInteger(0, 10)
				).map((value) => fakeUsersWoman[value]);
			} else {
				newFakePerson.photolink = getUniqueIntegerArr(
					0,
					fakeUsersMan.length - 1,
					getRandomInteger(0, 10)
				).map((value) => fakeUsersMan[value]);
			}
			newFakePerson.photomain = getRandomInteger(
				0,
				newFakePerson.photolink.length - 1
			);
			newFakePerson.signzodiac = getSignZodiac(
				newFakePerson.birthday,
				newFakePerson.monthofbirth
			);
			newFakePerson.education = getRandomInteger(
				0,
				data_education.length - 1
			);
			newFakePerson.fieldofactivity = getRandomInteger(
				0,
				data_fieldOfActivity.length - 1
			);
			newFakePerson.maritalstatus = getRandomInteger(
				0,
				data_maritalStatus.length - 1
			);
			newFakePerson.children = getRandomInteger(
				0,
				data_children.length - 1
			);
			newFakePerson.religion = getRandomInteger(
				0,
				data_religion.length - 1
			);
			newFakePerson.smoke = getRandomInteger(0, data_smoke.length - 1);
			newFakePerson.alcohol = getRandomInteger(
				0,
				data_alcohol.length - 1
			);
			newFakePerson.discription =
				fakeUsersHello[getRandomInteger(0, fakeUsersHello.length - 1)] +
				", меня зовут " +
				newFakePerson.name;
			newFakePerson.profit = getRandomInteger(0, data_profit.length - 1);
			newFakePerson.interests = getUniqueIntegerArr(
				0,
				interests.length - 1,
				getRandomInteger(0, 10)
			).map((value) => interests[value]);
			newFakePerson.ilikecharacter = getUniqueIntegerArr(
				0,
				data_iLikeСharacter.length - 1,
				getRandomInteger(0, 10)
			);
			newFakePerson.idontlikecharacter = getUniqueIntegerArr(
				0,
				data_iDontLikeСharacter.length - 1,
				getRandomInteger(0, 10)
			);
			newFakePerson.rating = getRandomInteger(0, 10000);
			newFakePerson.cash = getRandomInteger(1000, 10000);
			(newFakePerson.acctype = ACCTYPE.user),
				arrFakeUsers.push(newFakePerson);
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

		str += "]";
	}

	return str;
}

const fakeQueryStringUsersGenerate = async (
	countFakeUser: number
): Promise<string[]> => {
	let fakeQueryUsers: string[] = [];

	const fakeUsers = await fakeUsersGenerate(countFakeUser);

	fakeQueryUsers = fakeUsers.map((fakeUser) => {
		const strQuery =
			"INSERT INTO users (" +
			"email, password, jwt, " +
			"userid, coordinates, registrationdate, " +
			"timecode, name, location, likes, " +
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
			"visit, paid" +
			") VALUES (" +
			`'${fakeUser.email}', '${fakeUser.password}', ARRAY [] :: JSON [], ` +
			`'${fakeUser.userid}', ARRAY [] :: JSON[], ${fakeUser.registrationdate}, ` +
			`${fakeUser.timecode}, '${fakeUser.name}', '${
				fakeUser.location
			}', ${arrQueryStr(fakeUser.likes)}, ` +
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
			`ARRAY [] :: JSON [], '${JSON.stringify(fakeUser.paid)}' :: JSON` +
			")";

		return strQuery;
	});

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
