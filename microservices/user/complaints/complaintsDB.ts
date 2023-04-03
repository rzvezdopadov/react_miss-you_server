import { poolDB } from "../../../db/config";
import { getTimecodeNow } from "../../../utils/datetime";
import { COMPLAINTSTATUS, IComplaintBase } from "./icomplaints";

export async function getComplaintByIdFromDB(
	ourId: string,
	userTo: string
): Promise<IComplaintBase> {
	try {
		let answerDB: { rows: IComplaintBase[] } = { rows: [] };

		let queryStr =
			"SELECT userfrom, userto, timecode, dck, status, messages::json[], complmessages::json[] FROM complaints WHERE ";

		queryStr += `((userfrom = '${ourId}') AND (userto = '${userTo}'))`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rows[0];
	} catch (error) {
		console.log("getComplaintByIdFromDB", error);
		return undefined;
	}
}

export async function setComplaintByIdToDB(
	complaint: IComplaintBase
): Promise<number> {
	let answerDB = { rowCount: 0 };

	try {
		if (complaint.messages.length === 1) {
			const timecode = getTimecodeNow();
			complaint.timecode = timecode;

			const queryStr =
				`INSERT INTO complaints (` +
				`userfrom, userto, ` +
				`timecode, dck, ` +
				`status, ` +
				`messages` +
				`) VALUES (` +
				`'${complaint.userfrom}', '${complaint.userto}', ` +
				`${timecode}, '${complaint.dck}', '${COMPLAINTSTATUS.open}'` +
				`$1 :: json[]` +
				`)`;

			answerDB = await poolDB.query(queryStr, [complaint.messages]);

			return answerDB.rowCount;
		} else {
			const queryStr =
				`UPDATE complaints SET ` +
				`messages = $1 :: json[] ` +
				`status = '${COMPLAINTSTATUS.inwork}' ` +
				`WHERE ` +
				`((userfrom = '${complaint.userfrom}') AND (userto = '${complaint.userto}'))`;

			answerDB = await poolDB.query(queryStr, [complaint.messages]);

			return answerDB.rowCount;
		}
	} catch (error) {
		console.log("setComplaintByIdToDB", error);
		return 0;
	}
}

export async function getComplaintsByIdFromDB(
	ourId: string
): Promise<IComplaintBase[]> {
	try {
		let answerDB: { rows: IComplaintBase[] } = { rows: [] };

		let queryStr =
			`SELECT userfrom, userto, timecode, dck, status, messages::json[], complmessages::json[] ` +
			`FROM complaints WHERE userfrom = '${ourId}'`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rows;
	} catch (error) {
		console.log("getComplaintsByIdFromDB", error);
		return [];
	}
}
