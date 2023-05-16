import { poolDB } from "../../../../db/config";
import { getTimedateNow } from "../../../../utils/datetime";
import { IStickerpack } from "./istickerpacks";

export async function getAllStickerpacks(): Promise<IStickerpack[]> {
	try {
		let queryStr =
			`SELECT idstickerpack, name, discription, price, author, stickers ` +
			`FROM stickerpacks`;

		const answerDB = await poolDB.query(queryStr);

		return answerDB.rows;
	} catch (error) {
		console.log(`${getTimedateNow()} getAllStickerpacks: `, error);
		return undefined;
	}
}

export async function getStickerpackById(
	idStickerpack: string
): Promise<IStickerpack> {
	try {
		let queryStr =
			`SELECT idstickerpack, name, discription, price, author, stickers ` +
			`FROM stickerpacks ` +
			`WHERE idstickerpack = '${idStickerpack}'`;

		const answerDB = await poolDB.query(queryStr);

		return answerDB.rows[0];
	} catch (error) {
		console.log(`${getTimedateNow()} getStickerpackById: `, error);
		return undefined;
	}
}
