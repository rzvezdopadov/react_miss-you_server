import { poolDB } from "../db/config";

export async function getLikesByIdFromDB(userId: string): Promise<string[]> {
	try {
		let queryStr = `SELECT likes FROM users WHERE userid = '${userId}'`;
		const answerDB = await poolDB.query(queryStr);

		return answerDB.rows[0].likes;
	} catch (error) {
		console.log("getProfileByIdFromDB", error);
		return [];
	}
}

export async function setLikesByIdToDB(
	userId: string,
	arr: Array<string>
): Promise<number> {
	try {
		let queryStr = `UPDATE users SET likes = $1 WHERE userid = '${userId}'`;

		const answerDB = await poolDB.query(queryStr, [arr]);

		return answerDB.rowCount;
	} catch (error) {
		console.log("setLikesByIdFromDB", error);
		return 0;
	}
}
