import { poolDB } from "../../db/config";

export async function getFavoriteUsersByIdFromDB(
	userId: string
): Promise<string[]> {
	try {
		let queryStr = `SELECT favoriteusers FROM users WHERE userid = '${userId}'`;
		const answerDB = await poolDB.query(queryStr);

		return answerDB.rows[0].favoriteusers;
	} catch (error) {
		console.log("getFavoriteUsersByIdFromDB", error);
		return [];
	}
}

export async function setFavoriteUsersByIdToDB(
	userId: string,
	arr: string[]
): Promise<number> {
	try {
		let queryStr = `UPDATE users SET favoriteusers = $1 WHERE userid = '${userId}'`;

		const answerDB = await poolDB.query(queryStr, [arr]);

		return answerDB.rowCount;
	} catch (error) {
		console.log("setFavoriteUsersByIdToDB", error);
		return 0;
	}
}
