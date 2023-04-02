import { poolDB } from "../../db/config";

export async function getBannedUsersByIdFromDB(
	userId: string
): Promise<string[]> {
	try {
		let queryStr = `SELECT bannedusers FROM users WHERE userid = '${userId}'`;
		const answerDB = await poolDB.query(queryStr);

		return answerDB.rows[0].bannedusers;
	} catch (error) {
		console.log("getBannedUsersByIdFromDB", error);
		return [];
	}
}

export async function setBannedUsersByIdToDB(
	userId: string,
	arr: string[]
): Promise<number> {
	try {
		let queryStr = `UPDATE users SET bannedusers = $1 WHERE userid = '${userId}'`;

		const answerDB = await poolDB.query(queryStr, [arr]);

		return answerDB.rowCount;
	} catch (error) {
		console.log("setBannedUsersByIdToDB", error);
		return 0;
	}
}
