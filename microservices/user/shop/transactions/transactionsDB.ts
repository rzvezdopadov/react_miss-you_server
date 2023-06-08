import { poolDB } from "../../../../db/config";
import { getTimedateNow } from "../../../../utils/datetime";
import { ITransaction, ITransactionOutShort } from "./itransactions";

export async function getTransactionFromDB(
	userId: string
): Promise<ITransactionOutShort[]> {
	try {
		let queryStr =
			`SELECT timecode, userfrom, idtrans, cash, discription ` +
			`FROM transactions ` +
			`WHERE userid = '${userId}' ` +
			`ORDER BY timecode DESC`;

		const answerDB = await poolDB.query(queryStr);

		return answerDB.rows;
	} catch (error) {
		console.log(`${getTimedateNow()} getTransactionFromDB: `, error);
		return undefined;
	}
}

export async function setTransactionToDB(trans: ITransaction): Promise<number> {
	try {
		let queryStr =
			`INSERT INTO transactions (` +
			`userid, timecode, userfrom, idtrans, ` +
			`nametariff, idtariff, cash, discription` +
			`) VALUES (` +
			`'${trans.userid}', ${trans.timecode}, '${trans.userfrom}', '${trans.idtrans}', ` +
			`'${trans.nametariff}', '${trans.idtariff}', ${trans.cash}, '${trans.discription}'` +
			`)`;

		const answerDB = await poolDB.query(queryStr);

		return answerDB.rowCount;
	} catch (error) {
		console.log(`${getTimedateNow()} setTransactionToDB: `, error);
		return undefined;
	}
}
