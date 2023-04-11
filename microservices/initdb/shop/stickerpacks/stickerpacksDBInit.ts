import { poolDB } from "../../../../db/config";
import { stickerpacksData } from "./stickerpacksData";

const stickerpacksQueryGenerate = (): string[] => {
	const arrStickersQuery = stickerpacksData.map((item) => {
		let strStickers = "";

		item.stickers.forEach((value) => {
			strStickers += `'${JSON.stringify(value)}' :: JSON, `;
		});

		strStickers = strStickers.slice(0, -2);

		let str = `INSERT INTO public.stickerpacks(idstickerpack, name, discription, price, author, stickers) VALUES (
			'${item.idstickerpack}', '${item.name}', '${item.discription}', ${item.price}, '${item.author}', 
			(ARRAY [${strStickers}]));`;
		return str;
	});

	return arrStickersQuery;
};

export async function initDBStickerpacks(): Promise<boolean> {
	try {
		let queryStr = `
            CREATE TABLE IF NOT EXISTS stickerpacks (
                id serial PRIMARY KEY,
                idstickerpack TEXT,
                name TEXT,
                discription TEXT,
                price INT, 
                author TEXT,
                stickers JSON[]
            );
        `;

		await poolDB.query(queryStr);

		queryStr = `SELECT * FROM stickerpacks`;

		const answerDB = await poolDB.query(queryStr);

		if (!answerDB.rows[0]) {
			const queryStrArr = stickerpacksQueryGenerate();

			queryStrArr.forEach(async (value) => await poolDB.query(value));
		}

		console.log("initDB Stickers Ok!");
		return true;
	} catch (error) {
		console.log("initDB Stickers Error:", error);
		return false;
	}
}
