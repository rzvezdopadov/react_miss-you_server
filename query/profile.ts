import {
	IGetProfiles,
	IProfile,
	IProfileForDialog,
} from "../interfaces/iprofiles";
import { getYearFromAge } from "../utils/datetime";
import { poolDB } from "./config";

const fieldProfile =
	"userid, timecode, name, latitude, longitude, location, " +
	"likes, birthday, monthofbirth, yearofbirth, growth, weight, " +
	"gender, gendervapor, photomain, photolink, signzodiac, " +
	"education, fieldofactivity, maritalstatus, children, religion, " +
	"smoke, alcohol, discription, profit, interests, filters," +
	"ilikeCharacter, idontlikeCharacter, rating, stickerpacks, cash";

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
	"userid, timecode, name, birthday, monthofbirth, yearofbirth, gender, photomain, photolink, interests, rating";

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

			queryStr += "(yearofbirth >= $3) AND (yearofbirth <= $4) AND ";
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
				getYearFromAge(filters.ageend),
				getYearFromAge(filters.agestart),
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

		let profiles: IProfile[] = answerDB.rows;

		if (profiles.length > 1) {
			let newProfiles = profiles.sort((a, b) => b.rating - a.rating);

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

		let queryStr = `SELECT likes FROM users WHERE userid = '${QueryGetProfiles.userid}'`;

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
			"SELECT userid, name, birthday, monthofbirth, yearofbirth, photomain, photolink FROM users WHERE ";

		if (users) {
			if (users.length === 0) {
				return [];
			} else {
				users.forEach((value) => {
					queryStr += `(userid = '${value}' :: TEXT) OR `;
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

		queryStrProfile += "name = $2, location = $3, ";
		queryStrProfile +=
			"birthday = $4, monthofbirth = $5, yearofbirth = $6, ";
		queryStrProfile += "growth = $7, weight = $8, ";
		queryStrProfile += "gender = $9, gendervapor = $10, ";
		queryStrProfile += "signzodiac = $11, education = $12, ";
		queryStrProfile += "fieldofactivity = $13, maritalstatus = $14, ";
		queryStrProfile += "children = $15, religion = $16, ";
		queryStrProfile += "smoke = $17, alcohol = $18, ";
		queryStrProfile += "discription = $19, profit = $20, ";
		queryStrProfile += "interests = $21, ";
		queryStrProfile += "filters = $22, ";
		queryStrProfile += "ilikecharacter = $23, idontlikecharacter = $24 ";
		queryStrProfile += "WHERE userid = $1";

		const answerDBProfile = await poolDB.query(queryStrProfile, [
			ourId,
			profile.name,
			profile.location,
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

export async function getProfileCashByIdFromDB(
	userid: string
): Promise<number> {
	try {
		let queryStr = `SELECT cash FROM users WHERE userid = $1`;
		const answerDB = await poolDB.query(queryStr, [userid]);

		const { cash } = answerDB.rows[0];

		return cash;
	} catch (error) {
		console.log("getProfileCashByIdFromDB", error);
		return 0;
	}
}

export async function setProfileCashByIdToDB(
	userid: string,
	cash: number
): Promise<number> {
	try {
		let queryStr = `UPDATE users SET cash = $2 WHERE userid = $1`;
		const answerDB = await poolDB.query(queryStr, [userid, cash]);

		return answerDB.count;
	} catch (error) {
		console.log("setProfileCashByIdToDB", error);
		return 0;
	}
}

export async function getProfileRatingByIdFromDB(
	userid: string
): Promise<number> {
	try {
		let queryStr = `SELECT rating FROM users WHERE userid = $1`;
		const answerDB = await poolDB.query(queryStr, [userid]);

		const { rating } = answerDB.rows[0];

		return rating;
	} catch (error) {
		console.log("getProfileRatingByIdFromDB", error);
		return 0;
	}
}

export async function setProfileRatingByIdToDB(
	userid: string,
	rating: number
): Promise<number> {
	try {
		let queryStr = `UPDATE users SET rating = $2 WHERE userid = $1`;
		const answerDB = await poolDB.query(queryStr, [userid, rating]);

		return answerDB.count;
	} catch (error) {
		console.log("setProfileRatingByIdToDB", error);
		return 0;
	}
}

export async function getProfileStickerpacksByIdFromDB(
	userid: string
): Promise<string[]> {
	try {
		let queryStr = `SELECT stickerpacks FROM users WHERE userid = $1`;
		const answerDB = await poolDB.query(queryStr, [userid]);

		const { stickerpacks } = answerDB.rows[0];

		return stickerpacks;
	} catch (error) {
		console.log("getProfileStickerpacksByIdFromDB", error);
		return [];
	}
}

export async function setProfileStickerpacksByIdToDB(
	userid: string,
	stickerpacks: string[]
): Promise<number> {
	try {
		let queryStr = `UPDATE users SET stickerpacks = $2 WHERE userid = $1`;
		const answerDB = await poolDB.query(queryStr, [userid, stickerpacks]);

		return answerDB.count;
	} catch (error) {
		console.log("setProfileStickerpacksByIdToDB", error);
		return 0;
	}
}
