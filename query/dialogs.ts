import { IDialogBase } from "../interfaces/idialogs";
import { getTimecodeNow } from "../utils/datetime";
import { poolDB } from "./config";

export async function getDialogByIdFromDB(
	ourId: string,
	userId: string
): Promise<IDialogBase> {
	try {
		let answerDB: { rows: IDialogBase[] } = { rows: [] };

		let queryStr =
			"SELECT userid1, userid2, timecode, dck, messages::json[] FROM dialogs WHERE ";

		queryStr +=
			`(userid1 = '${ourId}' AND userid2 = '${userId}') OR ` +
			`(userid1 = '${userId}' AND userid2 = '${ourId}')`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rows[0];
	} catch (error) {
		console.log("getDialogByIdFromDB", error);
		return undefined;
	}
}

export async function setDialogByIdToDB(dialog: IDialogBase): Promise<number> {
	const timecode = getTimecodeNow();
	dialog.timecode = timecode;

	let answerDB = { rowCount: 0 };

	try {
		if (dialog.messages.length === 1) {
			const queryStr =
				`INSERT INTO dialogs (` +
				`userid1, userid2, ` +
				`timecode, dck, ` +
				`messages` +
				`) VALUES (` +
				`'${dialog.userid1}', '${dialog.userid2}', ` +
				`${timecode}, '${dialog.dck}', ` +
				`$1 :: json[]` +
				`)`;

			answerDB = await poolDB.query(queryStr, [dialog.messages]);

			return answerDB.rowCount;
		} else {
			const queryStr =
				`UPDATE dialogs SET ` +
				`messages = $1 :: json[] ` +
				`WHERE ` +
				`((userid1 = '${dialog.userid1}') AND (userid2 = '${dialog.userid2}')) OR ` +
				`((userid1 = '${dialog.userid2}') AND (userid1 = '${dialog.userid1}'))`;

			answerDB = await poolDB.query(queryStr, [dialog.messages]);

			return answerDB.rowCount;
		}
	} catch (error) {
		console.log("setDialogByIdToDB", error);
		return 0;
	}
}

export async function getDialogsByIdFromDB(
	ourId: string
): Promise<Array<IDialogBase>> {
	try {
		let answerDB: { rows: IDialogBase[] } = { rows: [] };

		let queryStr =
			`SELECT userid1, userid2, timecode, messages::json[] ` +
			`FROM dialogs WHERE (userid1 = '${ourId}') OR (userid2 = '${ourId}')`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rows;
	} catch (error) {
		console.log("getDialogsByIdFromDB", error);
		return [];
	}
}
