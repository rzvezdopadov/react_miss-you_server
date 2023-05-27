import { poolDB } from "../../../db/config";
import { getUniQueryFromDB } from "../../../db/uniquery";
import { getTimedateNow } from "../../../utils/datetime";
import { IJWT, IProfileRegistration } from "./iauth";

export async function getIdByEmailFromDB(email: string): Promise<string> {
	try {
		const answer = await getUniQueryFromDB(
			`users`,
			[`userid`],
			[`email = '${email}'`]
		);

		if (answer[0] && answer[0].userid) return answer[0].userid;

		return "";
	} catch (error) {
		console.log(`${getTimedateNow()} getIdByEmailFromDB: `, error);
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
		console.log(`${getTimedateNow()} getPasswordByIdFromDB: `, error);
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
		console.log(`${getTimedateNow()} `, "setPasswordByIdToDB:", error);
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
		console.log(`${getTimedateNow()} getJWTFromDB: `, error);
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
		console.log(`${getTimedateNow()} setJWTToDB: `, error);
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
			"timecode, name, location, phone, guests, likes, " +
			"favoriteusers, privateselections, bannedusers, presents, achivments," +
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
			"visit, paid, referral, deleteacc, temppasscode, " +
			"verifiacc, verifiacccode" +
			") VALUES (" +
			`'${profile.email}', '${profile.password}', ARRAY [] :: JSON [], ` +
			`'${profile.userid}', ARRAY [] :: JSON [], ${profile.registrationdate}, ` +
			`${profile.timecode}, '${profile.name}', '${profile.location}', '${profile.phone}', ARRAY [] :: TEXT [], ARRAY [] :: TEXT [], ` +
			`ARRAY [] :: TEXT [], ARRAY [] :: TEXT [], ARRAY [] :: TEXT [], ARRAY [] :: JSON [], ARRAY [] :: JSON [], ` +
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
			`ARRAY [] :: JSON [], '${JSON.stringify(profile.paid)}' :: JSON, ` +
			`'${profile.referral}', ${profile.deleteacc}, '${profile.temppasscode}', ` +
			`${profile.verifiacc}, '${profile.verifiacccode}'` +
			")";

		answerDB = await poolDB.query(queryStr);

		return answerDB.rowCount;
	} catch (error) {
		console.log(`${getTimedateNow()} createProfileToDB: `, error);
		return 0;
	}
}

export async function getIdByTemppasscodeDB(
	temppasscode: string
): Promise<string> {
	try {
		const answerDB = await getUniQueryFromDB(
			`users`,
			[`id`],
			[`temppasscode = '${temppasscode}'`]
		);

		if (answerDB[0] && answerDB[0].id) {
			return answerDB[0].id;
		}

		return "";
	} catch (error) {
		console.log(`${getTimedateNow()} getIdByTemppasscodeDB: `, error);
		return "";
	}
}

export async function setTemppasscodeByIdToDB(
	ourId: string,
	temppasscode: string
): Promise<string> {
	try {
		const answerDB = await poolDB.query(
			`UPDATE users SET temppasscode = '${temppasscode}' WHERE userid = '${ourId}'`
		);

		return answerDB.rowCount;
	} catch (error) {
		console.log(`${getTimedateNow()} `, "setTemppasscodeByIdToDB:", error);
		return "";
	}
}
