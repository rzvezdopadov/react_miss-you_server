import { ACCTYPE, IAdminBanned, IAdminStatVisit } from "../interfaces/iadmin";
import { poolDB } from "./config";

export async function getAdminAcctypeByIdFromDB(
	userId: string
): Promise<ACCTYPE> {
	try {
		const queryStr = "SELECT acctype FROM users WHERE userid = $1";
		const answerDB = await poolDB.query(queryStr, [userId]);

		return answerDB.rows[0];
	} catch (error) {
		console.log("getAdminAcctypeByIdFromDB", error);
		return ACCTYPE.user;
	}
}

export async function setAdminAcctypeByIdToDB(
	userId: string,
	acctype: ACCTYPE
): Promise<number> {
	try {
		const queryStr = "UPDATE users SET acctype = $2 WHERE userid = $1";
		const answerDB = await poolDB.query(queryStr, [userId, acctype]);

		return answerDB.count;
	} catch (error) {
		console.log("getAdminAcctypeByIdFromDB", error);
		return 0;
	}
}

export async function getAdminStatVisitByIdFromDB(
	userId?: string
): Promise<IAdminStatVisit[]> {
	try {
		let queryStr = `SELECT userid, visit FROM users WHERE userid = '${userId}'`;

		if (!userId) {
			queryStr = `SELECT userid, visit FROM users`;
		}

		const answerDB = await poolDB.query(queryStr);

		return answerDB.rows;
	} catch (error) {
		console.log("getAdminStatVisitByIdFromDB", error);
		return [];
	}
}

export async function getAdminBannedByIdFromDB(
	userId: string
): Promise<IAdminBanned> {
	try {
		const queryStr = "SELECT banned FROM users WHERE userid = $1";
		const answerDB = await poolDB.query(queryStr, [userId]);

		const { banned } = answerDB.rows[0];

		return banned;
	} catch (error) {
		console.log("getAdminBannedByIdFromDB", error);
		return { timecode: 0, whobanned: "", discription: "" };
	}
}

export async function setAdminBannedByIdToDB(
	userId: string,
	banned: IAdminBanned
): Promise<number> {
	try {
		const queryStr = "UPDATE users SET banned = $2 WHERE userid = $1";
		const answerDB = await poolDB.query(queryStr, [userId, banned]);

		return answerDB.count;
	} catch (error) {
		console.log("setAdminBannedByIdToDB", error);
		return 0;
	}
}
