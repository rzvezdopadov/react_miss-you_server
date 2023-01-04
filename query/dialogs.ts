import { IDialogBase } from "../interfaces/iprofiles";
import { getTimecodeNow } from "../utils/datetime";
import { poolDB } from "./config";

export async function getDialogByIdFromDB(
	ourId: string,
	userId: string
): Promise<IDialogBase> {
	try {
		let answerDB = { rows: [] };

		let queryStr =
			"SELECT userid1, userid2, timecode, dck, messages::json[] FROM dialogs WHERE ";

		queryStr +=
			"(userid1 = $1 AND userid2 = $2) OR (userid1 = $2 AND userid2 = $1)";

		answerDB = await poolDB.query(queryStr, [ourId, userId]);

		return answerDB.rows[0];
	} catch (error) {
		console.log("getDialogByIdFromDB", error);
		return {} as any;
	}
}

export async function setDialogByIdToDB(
	dialog: IDialogBase
): Promise<IDialogBase> {
	const timecode = getTimecodeNow();
	dialog.timecode = timecode;

	let answerDB = { rows: [] };

	try {
		if (dialog.messages.length === 1) {
			const queryStr =
				"INSERT INTO dialogs (userid1, userid2, timecode, dck, messages) VALUES ($1, $2, $3, $4, ARRAY [$5]::json[])";

			answerDB = await poolDB.query(queryStr, [
				dialog.userid1,
				dialog.userid2,
				timecode,
				dialog.dck,
				dialog.messages[0],
			]);

			return answerDB.rows[0];
		} else {
			const queryStr =
				"UPDATE dialogs SET messages = $3::json[] WHERE ((userid1 = $1) AND (userid2 = $2)) OR ((userid1 = $2) AND (userid1 = $1))";

			answerDB = await poolDB.query(queryStr, [
				dialog.userid1,
				dialog.userid2,
				dialog.messages,
			]);

			return answerDB.rows[0];
		}
	} catch (error) {
		console.log("setDialogByIdToDB", error);
		return {} as any;
	}
}

export async function getDialogsByIdFromDB(
	ourId: string
): Promise<Array<IDialogBase>> {
	try {
		let answerDB = { rows: [] };

		let queryStr =
			"SELECT userid1, userid2, timecode, messages::json[] FROM dialogs WHERE (userid1 = $1) OR (userid2 = $1)";

		answerDB = await poolDB.query(queryStr, [ourId]);

		return answerDB.rows;
	} catch (error) {
		console.log("getDialogsByIdFromDB", error);
		return [];
	}
}
