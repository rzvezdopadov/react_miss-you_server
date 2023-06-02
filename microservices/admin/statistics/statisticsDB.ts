import { poolDB } from "../../../db/config";
import { getTimecodeNow, getTimedateNow } from "../../../utils/datetime";
import { IStatVisit } from "./istatistics";

const selectKey = `userid, key, tco, tcc`;

export async function getVisitsByIdFromDB(payload: {
	userId: string;
}): Promise<IStatVisit[]> {
	try {
		let answerDB = { rows: [] };

		let queryStr = `SELECT ${selectKey} FROM visit WHERE (userid = '${payload.userId}'))`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rows;
	} catch (error) {
		console.log(`${getTimedateNow()} getVisitByIdFromDB: `, error);
		return undefined;
	}
}

export async function getVisitByIdFromDB(payload: {
	userId: string;
	key: string;
}): Promise<IStatVisit> {
	try {
		let answerDB = { rows: [] };

		let queryStr = `SELECT ${selectKey} FROM visit WHERE (userid = '${payload.userId}') AND (key = '${payload.key}')`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rows[0];
	} catch (error) {
		console.log(`${getTimedateNow()} getVisitByIdFromDB: `, error);
		return undefined;
	}
}

export async function setVisitByIdToDB(payload: IStatVisit): Promise<number> {
	try {
		let queryStr = ``;
		if (!payload.tcc) {
			queryStr +=
				`INSERT INTO visit (` +
				`${selectKey}` +
				`) VALUES (` +
				`'${payload.userid}', '${payload.key}', ${payload.tco}, ${payload.tcc}` +
				`)`;
		} else {
			queryStr =
				`UPDATE visit ` +
				`SET tcc = ${payload.tcc} ` +
				`WHERE (userid = '${payload.userid}') AND (key = '${payload.key}')`;
		}

		const answerDB = await poolDB.query(queryStr);

		return answerDB.rowCount;
	} catch (error) {
		console.log(`${getTimedateNow()} setVisitByIdToDB: `, error);

		return 0;
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
		console.log(`${getTimedateNow()} setTimecodeToDB: `, error);
		return 0;
	}
}
