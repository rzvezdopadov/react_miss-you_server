import { getTimecodeNow, getTimedateNow } from "../../../utils/datetime";
import { poolDB } from "../../../db/config";
import { IGetMessages, IMessageOutput, IQueryMessage } from "./idialogs";
import { getRandomString } from "../../../utils/random";

export async function getMessagesByIdFromDB(
	getMessages: IGetMessages
): Promise<IMessageOutput[]> {
	try {
		let answerDB: { rows: IMessageOutput[] } = { rows: [] };

		let queryStr =
			`SELECT timecode, id1, id2, dck, type, msg, spkid, spos FROM messages WHERE ` +
			`((id1 = '${getMessages.ourid}' AND id2 = '${getMessages.userid}') OR ` +
			`(id1 = '${getMessages.userid}' AND id2 = '${getMessages.ourid}')) ` +
			`ORDER BY timecode ASC ` +
			`LIMIT ${getMessages.amount} OFFSET ${getMessages.startcount}`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rows;
	} catch (error) {
		console.log(`${getTimedateNow()} getMessagesByIdFromDB: `, error);
		return [];
	}
}

export async function setMessageByIdToDB(
	message: IQueryMessage
): Promise<IMessageOutput> {
	const timecode = getTimecodeNow();

	let answerDB = { rowCount: 0 };

	try {
		if (!message || !message.id1 || !message.id2) return undefined;

		const dck = getRandomString(10);

		const queryStr =
			`INSERT INTO messages (` +
			`timecode, ` +
			`id1, id2, ` +
			`id1del, id2del, ` +
			`id1rd, id2rd, ` +
			`dck, type, msg, ` +
			`spkid, spos` +
			`) VALUES (` +
			`${timecode}, ` +
			`'${message.id1}', '${message.id2}', ` +
			`false, false, ` +
			`false, false, ` +
			`'${dck}', ${message.type}, '${message.msg}', ` +
			`'${message.spkid}', ${message.spos}` +
			`)`;

		answerDB = await poolDB.query(queryStr);

		if (!answerDB.rowCount) return undefined;

		const messageOutput: IMessageOutput = {
			timecode,
			id1: message.id1,
			id2: message.id2,
			id1rd: false,
			id2rd: false,
			dck,
			type: message.type,
			msg: message.msg,
			spkid: message.spkid,
			spos: message.spos,
		};

		return messageOutput;
	} catch (error) {
		console.log(`${getTimedateNow()} setMessageByIdToDB: `, error);
		return undefined;
	}
}

export async function getDialogsByIdFromDB(ourId: string): Promise<string[]> {
	try {
		interface IBase {
			id1: string;
			id2: string;
		}
		let answerDB: { rows: IBase[] } = { rows: [] };

		let queryStr =
			`SELECT DISTINCT id1, id2 ` +
			`FROM messages WHERE (id1 = '${ourId}') OR (id2 = '${ourId}')`;

		answerDB = await poolDB.query(queryStr);
		if (answerDB && answerDB.rows && answerDB.rows.length !== 0) {
			const newArr = Array.from(
				new Set(
					answerDB.rows.map((value) => {
						if (value.id1 !== ourId) return value.id1;
						if (value.id2 !== ourId) return value.id2;
					})
				)
			);
			return newArr;
		}

		return [];
	} catch (error) {
		console.log(`${getTimedateNow()} getDialogsByIdFromDB: `, error);
		return [];
	}
}
