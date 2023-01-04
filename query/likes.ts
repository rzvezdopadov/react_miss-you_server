import { poolDB } from "./config";

export async function getLikesByIdFromDB(
	userId: string
): Promise<Array<string>> {
	try {
		let queryStr = "SELECT likes FROM users WHERE userid = $1";
		const answerDB = await poolDB.query(queryStr, [userId]);

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
		let queryStr = "UPDATE users SET likes = $1 WHERE userid = $2";

		const answerDB = await poolDB.query(queryStr, [arr, userId]);

		return answerDB.rowCount;
	} catch (error) {
		console.log("setLikesByIdFromDB", error);
		return 0;
	}
}
