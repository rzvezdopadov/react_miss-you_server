import { IDialogBase } from "../interfaces/iprofiles";
import { getTimecodeNow } from "../utils/datetime";
import { poolDB } from "./config";

export async function getDialogByIdFromDB(
	id: number,
	idUser: number,
	idDialog: number = 0
): Promise<IDialogBase> {
	try {
		let answerDB = { rows: [] };

		let queryStr =
			"SELECT id, id1, id2, timecode, dck, messages::json[] FROM dialogs WHERE ";

		if (idDialog) {
			queryStr += "id = $1";

			answerDB = await poolDB.query(queryStr, [idDialog]);
		} else {
			queryStr += "(id1 = $1 AND id2 = $2) OR (id1 = $2 AND id2 = $1)";

			answerDB = await poolDB.query(queryStr, [id, idUser]);
		}

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
				"INSERT INTO dialogs (id1, id2, timecode, dck, messages) VALUES ($1, $2, $3, $4, ARRAY [$5]::json[])";

			answerDB = await poolDB.query(queryStr, [
				dialog.id1,
				dialog.id2,
				timecode,
				dialog.dck,
				dialog.messages[0],
			]);

			return answerDB.rows[0];
		} else {
			const queryStr =
				"UPDATE dialogs SET messages = $2::json[] WHERE id = $1";

			answerDB = await poolDB.query(queryStr, [
				dialog.id,
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
	idUser: number
): Promise<Array<IDialogBase>> {
	try {
		let answerDB = { rows: [] };

		let queryStr =
			"SELECT id, id1, id2, timecode, messages::json[] FROM dialogs WHERE (id1 = $1) OR (id2 = $1)";

		answerDB = await poolDB.query(queryStr, [idUser]);

		return answerDB.rows;
	} catch (error) {
		console.log("getDialogsByIdFromDB", error);
		return [];
	}
}
