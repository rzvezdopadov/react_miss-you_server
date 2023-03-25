import { IJWT, IProfileRegistration } from "./iauth";
import { poolDB } from "../../db/config";
import { getUniQueryFromDB } from "../../db/uniquery";

export async function getIdByEmailFromDB(email: string): Promise<string> {
	try {
		return (
			await getUniQueryFromDB(`users`, [`userid`], [`email = '${email}'`])
		)[0].userid;
	} catch (error) {
		console.log("getIdByEmailFromDB:", error);
		return "";
	}
}

export async function getPasswordByIdFromDB(ourId: string): Promise<string> {
	try {
		return (
			await getUniQueryFromDB(
				`users`,
				[`password`],
				[`userid = '${ourId}'`]
			)
		)[0].password;
	} catch (error) {
		console.log("getPasswordByIdFromDB:", error);
		return "";
	}
}

export async function setPasswordByIdToDB(
	ourId: string,
	hashedPassword: string
): Promise<string> {
	try {
		const answerDB = await poolDB.query(
			`UPDATE users SET password = '${hashedPassword}' WHERE userid = '${ourId}'`
		);

		return answerDB.rowCount;
	} catch (error) {
		console.log("setPasswordByIdToDB:", error);
		return "";
	}
}

export async function getJWTFromDB(ourId: string): Promise<IJWT[]> {
	try {
		const answerDB = await poolDB.query(
			`SELECT jwt FROM users WHERE userid = '${ourId}'`
		);

		if (answerDB.rows[0]?.jwt) return answerDB.rows[0].jwt;

		return undefined;
	} catch (error) {
		console.log("getJWTFromDB:", error);
		return undefined;
	}
}

export async function setJWTToDB(ourId: string, jwts: IJWT[]): Promise<number> {
	try {
		const answerDB = await poolDB.query(
			`UPDATE users ` +
				`SET jwt = $1 :: JSON[]` +
				`WHERE userid = '${ourId}'`,
			[jwts]
		);

		return answerDB.rowCount;
	} catch (error) {
		console.log("setJWTToDB:", error);
		return 0;
	}
}

export async function createProfileToDB(
	profile: IProfileRegistration
): Promise<number> {
	let answerDB = { rowCount: 0 };

	try {
		const queryStr =
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
			`'${profile.email}', '${profile.password}', ARRAY [] :: JSON [], ` +
			`'${profile.userid}', ARRAY [] :: JSON[], ${profile.registrationdate}, ` +
			`${profile.timecode}, '${profile.name}', '${profile.location}', ARRAY [] :: TEXT [], ` +
			`${profile.birthday}, ${profile.monthofbirth}, ${profile.yearofbirth}, ` +
			`${profile.growth}, ${profile.weight}, ` +
			`${profile.gender}, ${profile.gendervapor}, ` +
			`${profile.photomain}, ARRAY [] :: TEXT [], ` +
			`${profile.signzodiac}, ${profile.education}, ` +
			`${profile.fieldofactivity}, ${profile.maritalstatus}, ` +
			`${profile.children}, ${profile.religion}, ` +
			`${profile.smoke}, ${profile.alcohol}, ` +
			`'${profile.discription}', ${profile.profit}, ` +
			`ARRAY [] :: TEXT [], ` +
			`'${JSON.stringify(profile.filters)}' :: JSON, ` +
			`ARRAY [] :: INTEGER [], ARRAY [] :: INTEGER [], ` +
			`ARRAY [] :: TEXT [], ` +
			`${profile.rating}, ${profile.cash}, '${profile.acctype}', ` +
			`'${JSON.stringify(profile.banned)}' :: JSON, ` +
			`ARRAY [] :: JSON [], '${JSON.stringify(profile.paid)}' :: JSON` +
			")";

		answerDB = await poolDB.query(queryStr);

		return answerDB.rowCount;
	} catch (error) {
		console.log("createProfileToDB", error);
		return 0;
	}
}
