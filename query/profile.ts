import {
	IGetProfiles,
	IProfile,
	IProfileForDialog,
} from "../interfaces/iprofiles";
import { lazyloadingusercount } from "../utils/globalconst";
import { poolDB } from "./config";

const fieldProfile =
	"userid, timecode, name, latitude, longitude, location, " +
	"likes, age, birthday, monthofbirth, yearofbirth, growth, weight, " +
	"gender, gendervapor, photomain, photolink, signzodiac, " +
	"education, fieldofactivity, maritalstatus, children, religion, " +
	"smoke, alcohol, discription, profit, interests, filters," +
	"ilikeCharacter, idontlikeCharacter, raiting";

const fieldFilters =
	"location, signzodiac, agestart, ageend, " +
	"growthstart, growthend, weight, gendervapor, " +
	"religion, smoke, alcohol, interests";
export async function getProfileByIdFromDB(userid: string): Promise<IProfile> {
	try {
		let queryStr = `SELECT ${fieldProfile} FROM users WHERE userid = $1`;
		const answerDB = await poolDB.query(queryStr, [userid]);

		if (!answerDB.rows[0]) return undefined;

		return answerDB.rows[0];
	} catch (error) {
		console.log("getProfileByIdFromDB", error);
		return undefined;
	}
}

const fieldProfileShort =
	"userid, timecode, name, age, gender, photomain, photolink, interests, raiting";

export async function getProfiles(
	QueryGetProfiles: IGetProfiles
): Promise<IProfile[]> {
	const startPos = Number(QueryGetProfiles.startcount);
	const endPos = startPos + Number(QueryGetProfiles.amount);
	const { filters, users } = QueryGetProfiles;

	try {
		let answerDB = { rows: [] };

		let queryStr = `SELECT ${fieldProfileShort} FROM users WHERE `;

		if (filters) {
			queryStr += "(location = $1) AND ";

			if (filters.signzodiac === 12) {
				queryStr += "(signzodiac <> $2) AND ";
			} else {
				queryStr += "(signzodiac = $2) AND ";
			}

			queryStr += "(age >= $3) AND (age <= $4) AND ";
			queryStr += "(growth >= $5) AND (growth <= $6) AND ";

			if (filters.weight === 0) {
				queryStr += "((weight <> $7) OR (weight = 0)) AND ";
			} else {
				queryStr += "(weight = $7) AND ";
			}

			queryStr += "(gendervapor = $8) AND ";

			if (filters.religion === 0) {
				queryStr += "((religion <> $9) OR (religion = 0)) AND ";
			} else {
				queryStr += "(religion = $9) AND ";
			}

			if (filters.smoke === 0) {
				queryStr += "((smoke <> $10) OR (smoke = 0)) AND ";
			} else {
				queryStr += "(smoke = $10) AND ";
			}

			if (filters.alcohol === 0) {
				queryStr += "((alcohol <> $11) OR (alcohol = 0)) AND ";
			} else {
				queryStr += "(alcohol = $11) AND ";
			}

			queryStr += "(userid <> $12)";

			let gendervapor = filters.gendervapor;

			if (filters.gendervapor === 0) {
				gendervapor = 1;
			} else if (filters.gendervapor === 1) {
				gendervapor = 0;
			}

			answerDB = await poolDB.query(queryStr, [
				filters.location,
				filters.signzodiac,
				filters.agestart,
				filters.ageend,
				filters.growthstart,
				filters.growthend,
				filters.weight,
				gendervapor,
				filters.religion,
				filters.smoke,
				filters.alcohol,
				QueryGetProfiles.userid,
			]);
		} else if (users) {
			if (users.length === 0) {
				return [];
			} else {
				users.forEach((value) => {
					queryStr += `(userid = ${value} :: TEXT) OR `;
				});
			}

			queryStr = queryStr.slice(0, -3);

			answerDB = await poolDB.query(queryStr);
		}

		let profiles = answerDB.rows;

		if (profiles.length > 1) {
			let newProfiles = profiles.sort((a, b) => b.raiting - a.raiting);

			if (startPos - endPos) {
				newProfiles = newProfiles.slice(startPos, endPos);
			}

			profiles = newProfiles;
		}

		return profiles;
	} catch (error) {
		console.log("getProfiles", error);
		return [];
	}
}

export async function getProfilesForLikes(
	QueryGetProfiles: IGetProfiles
): Promise<IProfile[]> {
	const startPos = Number(QueryGetProfiles.startcount);
	const endPos = startPos + Number(QueryGetProfiles.amount);

	try {
		let answerDB = { rows: [] };

		let queryStr = `SELECT likes FROM users WHERE userid = ${QueryGetProfiles.userid} :: TEXT`;

		answerDB = await poolDB.query(queryStr);

		if (answerDB.rows.length === 0) {
			return [];
		}

		const { likes } = answerDB.rows[0];

		queryStr = `SELECT ${fieldProfileShort} FROM users WHERE `;

		if (likes.length === 0) {
			return [];
		} else {
			likes.forEach((value) => {
				queryStr += `(userid = ${value} :: TEXT) OR `;
			});
		}

		queryStr = queryStr.slice(0, -3);

		answerDB = await poolDB.query(queryStr);

		let profiles = answerDB.rows;

		if (profiles.length > 1) {
			let newProfiles = profiles.sort((a, b) => b.raiting - a.raiting);

			if (startPos - endPos) {
				newProfiles = newProfiles.slice(startPos, endPos);
			}

			profiles = newProfiles;
		}

		return profiles;
	} catch (error) {
		console.log("getProfilesForLikes", error);
		return [];
	}
}

export async function getProfilesForDialogs(
	users: Array<string>
): Promise<IProfileForDialog[]> {
	try {
		let answerDB = { rows: [] };

		let queryStr =
			"SELECT userid, name, age, photomain, photolink FROM users WHERE ";

		if (users) {
			if (users.length === 0) {
				return [];
			} else {
				users.forEach((value) => {
					queryStr += "(userid = " + value + " :: TEXT) OR ";
				});
			}

			queryStr = queryStr.slice(0, -3);

			answerDB = await poolDB.query(queryStr);
		}

		return answerDB.rows;
	} catch (error) {
		console.log("getProfilesForDialogs", error);
		return [];
	}
}

export async function setProfileByIdToDB(
	ourId: string,
	profile: IProfile
): Promise<IProfile> {
	try {
		let queryStrProfile = "UPDATE users SET ";

		queryStrProfile += "name = $2, location = $3, age = $4, ";
		queryStrProfile +=
			"birthday = $5, monthofbirth = $6, yearofbirth = $7, ";
		queryStrProfile += "growth = $8, weight = $9, ";
		queryStrProfile += "gender = $10, gendervapor = $11, ";
		queryStrProfile += "signzodiac = $12, education = $13, ";
		queryStrProfile += "fieldofactivity = $14, maritalstatus = $15, ";
		queryStrProfile += "children = $16, religion = $17, ";
		queryStrProfile += "smoke = $18, alcohol = $19, ";
		queryStrProfile += "discription = $20, profit = $21, ";
		queryStrProfile += "interests = $22, ";
		queryStrProfile += "filters = $23, ";
		queryStrProfile += "ilikecharacter = $24, idontlikecharacter = $25 ";
		queryStrProfile += "WHERE userid = $1";

		const answerDBProfile = await poolDB.query(queryStrProfile, [
			ourId,
			profile.name,
			profile.location,
			profile.age,
			profile.birthday,
			profile.monthofbirth,
			profile.yearofbirth,
			profile.growth,
			profile.weight,
			profile.gender,
			profile.gendervapor,
			profile.signzodiac,
			profile.education,
			profile.fieldofactivity,
			profile.maritalstatus,
			profile.children,
			profile.religion,
			profile.smoke,
			profile.alcohol,
			profile.discription,
			profile.profit,
			profile.interests,
			profile.filters,
			profile.ilikecharacter,
			profile.idontlikecharacter,
		]);
	} catch (error) {
		console.log("setProfileByIdToDB:", error);
	}

	try {
		const newProfile = await getProfileByIdFromDB(ourId);
		return newProfile;
	} catch (error) {
		console.log("setProfileByIdToDB get:", error);
		return undefined;
	}
}

export function setProfileShort(profile: IProfile) {
	// for (let i = 0; i < userList.length; i++) {
	//     if (userList[i].id === profile.id) {

	//         return true;
	//     }
	// }

	return false;
}
