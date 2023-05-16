import { poolDB } from "../../../db/config";
import { getTimecodeNow, getTimedateNow } from "../../../utils/datetime";
import { COMPLAINTSTATUS, COMPLAINTTYPE, IComplaintBase } from "./icomplaints";

export async function getComplaintByIdFromDB(
	ourId: string,
	userTo: string,
	type: COMPLAINTTYPE
): Promise<IComplaintBase> {
	try {
		let answerDB: { rows: IComplaintBase[] } = { rows: [] };

		let queryStr =
			"SELECT userfrom, userto, timecode, type, subject, discription, cash, dck, status, complmessage::json FROM complaints WHERE ";

		queryStr += `((userfrom = '${ourId}') AND (userto = '${userTo}') AND (type = '${type}'))`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rows[0];
	} catch (error) {
		console.log(`${getTimedateNow()} getComplaintByIdFromDB: `, error);
		return undefined;
	}
}

export async function setComplaintByIdToDB(
	complaint: IComplaintBase
): Promise<number> {
	let answerDB = { rowCount: 0 };

	try {
		const complaintDB = await getComplaintByIdFromDB(
			complaint.userfrom,
			complaint.userto,
			complaint.type
		);

		if (!complaintDB) {
			complaint.timecode = getTimecodeNow();
			complaint.cash = 0;

			const queryStr =
				`INSERT INTO complaints (` +
				`userfrom, userto, ` +
				`timecode, type, subject, ` +
				`discription, cash, dck, status, ` +
				`complmessage` +
				`) VALUES (` +
				`'${complaint.userfrom}', '${complaint.userto}', ` +
				`${complaint.timecode}, '${complaint.type}', '${complaint.subject}', ` +
				`'${complaint.discription}', ${complaint.cash}, '${complaint.dck}', '${COMPLAINTSTATUS.open}', ` +
				`$1 :: json` +
				`)`;

			answerDB = await poolDB.query(queryStr, [complaint.complmessage]);

			return answerDB.rowCount;
		} else {
			const queryStr =
				`UPDATE complaints SET ` +
				`subject = '${complaint.subject}', ` +
				`discription = '${complaint.discription}', ` +
				`status = '${COMPLAINTSTATUS.open}', ` +
				`complmessage = $1 :: json ` +
				`WHERE ` +
				`((userfrom = '${complaint.userfrom}') AND (userto = '${complaint.userto}') AND (type = '${complaint.type}'))`;

			answerDB = await poolDB.query(queryStr, [complaint.complmessage]);

			return answerDB.rowCount;
		}
	} catch (error) {
		console.log(`${getTimedateNow()} setComplaintByIdToDB: `, error);
		return 0;
	}
}

export async function getComplaintsByIdFromDB(
	ourId: string
): Promise<IComplaintBase[]> {
	try {
		let answerDB: { rows: IComplaintBase[] } = { rows: [] };

		let queryStr =
			`SELECT userfrom, userto, timecode, type, subject, discription, cash, dck, status, complmessage::json ` +
			`FROM complaints WHERE userfrom = '${ourId}'`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rows;
	} catch (error) {
		console.log(`${getTimedateNow()} getComplaintsByIdFromDB: `, error);
		return [];
	}
}
