import { poolDB } from "../../../db/config";
import { getUniQueryFromDB } from "../../../db/uniquery";
import { IPaid } from "./ipaid";

export async function getPaidByIdFromDB(ourId: string): Promise<IPaid> {
	try {
		const answerDB: IPaid = (
			await getUniQueryFromDB(`users`, [`paid`], [`userid = '${ourId}'`])
		)[0].paid;

		return answerDB;
	} catch (error) {
		console.log("getPaidFromDB", error);
		return undefined;
	}
}

export async function setPaidByIdToDB(
	ourId: string,
	paid: IPaid
): Promise<number> {
	try {
		let queryStr = `UPDATE users SET paid = ${paid} ::json[] WHERE userid = ${ourId}`;

		const answerDB = await poolDB.query(queryStr);

		return answerDB.rowCount;
	} catch (error) {
		console.log("setPaidToDB", error);
		return 0;
	}
}
