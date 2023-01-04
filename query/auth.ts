import { IProfile } from "../interfaces/iprofiles";
import { poolDB } from "./config";

export async function getIdByEmailFromDB(email: string): Promise<string> {
	try {
		const answerDB = await poolDB.query(
			"SELECT userid FROM users WHERE email = $1",
			[email]
		);

		return answerDB.rows[0].userid;
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

export function createProfile(profile: IProfile) {
	// Create base Profile in DB
	// let id = 0;

	// for (let i = 0; i < userList.length; i++) {
	//     id = Math.max(id, userList[i].id);
	// }

	// profile.id = id + 1;

	// userList.push(profile);

	return true;
}
