import { poolDB } from "../../db/config";
import { getTimecodeNow } from "../../utils/datetime";
import { IStatVisit, IStatisticsVisit } from "./istatistics";

export async function setVisitByIdToDB(
	payload: IStatisticsVisit
): Promise<number> {
	try {
		const queryStr =
			`UPDATE users ` +
			`SET visit = $1 :: JSON[] ` +
			`WHERE userid = '${payload.userid}'`;

		const answerDB = await poolDB.query(queryStr, [payload.visit]);

		return answerDB.rowCount;
	} catch (error) {
		console.log("setVisitByIdToDB", error);

		return 0;
	}
}

export async function getVisitByIdFromDB(
	userId: string
): Promise<IStatisticsVisit> {
	try {
		let answerDB = { rows: [] };

		let queryStr = `SELECT userid, visit::json[] FROM users WHERE userid = '${userId}'`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rows[0];
	} catch (error) {
		console.log("getVisitByIdFromDB", error);

		return undefined;
	}
}

export async function setTimecodeToDB(ourId: string): Promise<number> {
	const timecode = getTimecodeNow();

	try {
		const answerDB = await poolDB.query(
			`UPDATE users SET timecode = ${timecode} WHERE userid = '${ourId}'`
		);

		return timecode;
	} catch (error) {
		console.log("setTimecodeToDB:", error);
		return 0;
	}
}
