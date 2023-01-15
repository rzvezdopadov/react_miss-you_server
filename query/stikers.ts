import { IStickerpack } from "../interfaces/iprofiles";
import { poolDB } from "./config";

export async function getAllStickerpacks(): Promise<IStickerpack[]> {
	try {
		let queryStr =
			"SELECT idstickerpack, name, discription, price, author, stickers FROM stickerpacks";

		const answerDB = await poolDB.query(queryStr);

		return answerDB.rows;
	} catch (error) {
		console.log("getAllStickerpacks", error);
		return [];
	}
}

export async function getStickerpackById(
	idStickerpack: string
): Promise<IStickerpack> {
	const stickerpack: IStickerpack = {
		idstickerpack: "",
		name: "",
		discription: "",
		price: 0,
		author: "",
		stickers: [],
	};

	try {
		let queryStr =
			"SELECT  idstickerpack, name, discription, price, author, stickers FROM stickerpacks WHERE idstickerpack = $1";
		const answerDB = await poolDB.query(queryStr, [idStickerpack]);

		return answerDB.rows[0];
	} catch (error) {
		console.log("getAllStickerpacks", error);
		return stickerpack;
	}
}
