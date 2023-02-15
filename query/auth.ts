import { IProfileRegistration } from "../interfaces/iprofiles";
import { poolDB } from "./config";

export async function getIdByEmailFromDB(email: string): Promise<string> {
	try {
		const answerDB = await poolDB.query(
			"SELECT userid FROM users WHERE email = $1",
			[email]
		);
		if (answerDB.rows[0]) return answerDB.rows[0].userid;
		return "";
	} catch (error) {
		console.log(error);
		return "";
	}
}

export async function getPasswordByIdFromDB(ourId: string): Promise<string> {
	try {
		const answerDB = await poolDB.query(
			"SELECT password FROM users WHERE userid = $1",
			[ourId]
		);

		return answerDB.rows[0].password;
	} catch (error) {
		console.log(error);
		return "";
	}
}

export async function setPasswordByIdToDB(
	ourId: string,
	hashedPassword: string
): Promise<string> {
	// Set hashed password in DB
	try {
		const answerDB = await poolDB.query(
			"UPDATE users SET password = $1 WHERE userid = $2",
			[hashedPassword, ourId]
		);

		return answerDB.rowCount;
	} catch (error) {
		console.log(error);
		return "";
	}
}

export async function setJWTToDB(ourId: string, jwt: string): Promise<number> {
	// Set JWT in DB
	try {
		const answerDB = await poolDB.query(
			"UPDATE users SET jwt = $1 WHERE userid = $2",
			[jwt, ourId]
		);

		return answerDB.rowCount;
	} catch (error) {
		console.log("setProfileByIdToDB:", error);
		return 0;
	}
}

export async function setTimecodeToDB(ourId: string): Promise<number> {
	// Set Time code in DB
	const date = new Date();
	const timecode = date.getTime();

	try {
		const answerDB = await poolDB.query(
			"UPDATE users SET timecode = $2 WHERE userid = $1",
			[ourId, timecode]
		);

		return timecode;
	} catch (error) {
		console.log("setTimecodeToDB:", error);
		return 0;
	}
}

export async function getJWTFromDB(ourId: string): Promise<String> {
	// Get JWT in DB
	try {
		const answerDB = await poolDB.query(
			"SELECT jwt FROM users WHERE userid = $1",
			[ourId]
		);

		if (answerDB.rows[0]?.jwt) return answerDB.rows[0].jwt;

		return "";
	} catch (error) {
		console.log("getJWTFromDB:", error);
		return "";
	}
}

export async function createProfile(
	profile: IProfileRegistration
): Promise<boolean> {
	let answerDB = { rowCount: false };

	try {
		const queryStr =
			"INSERT INTO users (" +
			"email, password, jwt, userid, ipaddress, timecode, " +
			"name, latitude, longitude, location, likes, " +
			"birthday, monthofbirth, yearofbirth, growth, weight, " +
			"gender, gendervapor, photomain, photolink, signzodiac, " +
			"education, fieldofactivity, maritalstatus, children, " +
			"religion, smoke, alcohol, discription, profit, interests, " +
			"filters, ilikecharacter, idontlikecharacter, " +
			"raiting, cash, stickerpacks, acctype, visit" +
			") VALUES (" +
			`'${profile.email}', '${profile.password}', '', '${profile.userid}', '0.0.0.0', ${profile.timecode}, ` +
			`'${profile.name}', 0, 0, '${profile.location}', ARRAY [] :: TEXT [], ` +
			`${profile.birthday}, ${profile.monthofbirth}, ${profile.yearofbirth}, ${profile.growth}, ${profile.weight}, ` +
			`${profile.gender}, ${profile.gendervapor}, ${profile.photomain}, ARRAY [] :: TEXT [], ${profile.signzodiac}, ` +
			`${profile.education}, ${profile.fieldofactivity}, ${profile.maritalstatus}, ${profile.children}, ` +
			`${profile.religion}, ${profile.smoke}, ${profile.alcohol}, '${profile.discription}', ${profile.profit}, ARRAY [] :: TEXT [], ` +
			`'${JSON.stringify(
				profile.filters
			)}' :: JSON, ARRAY [] :: INTEGER [], ARRAY [] :: INTEGER [], ` +
			`${profile.raiting}, ${profile.cash}, ARRAY [] :: TEXT [], '${profile.acctype}', ARRAY [] :: JSON []` +
			")";

		console.log(queryStr);

		answerDB = await poolDB.query(queryStr);
		console.log(answerDB);

		return answerDB.rowCount;
	} catch (error) {
		console.log(error);
		return false;
	}
}
