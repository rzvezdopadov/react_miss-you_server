import { IRate } from "../../interfaces/ishop";
import { poolDB } from "../initDB/config";

export async function getRatingTariffs(): Promise<IRate[]> {
	try {
		let answerDB = { rows: [] };

		let queryStr = "SELECT ratingtariffs FROM shop";

		answerDB = await poolDB.query(queryStr);

		const { ratingtariffs } = answerDB.rows[0];

		return ratingtariffs;
	} catch (error) {
		console.log("getRatingTariffs", error);
		return [];
	}
}

export async function setRatingTariffs(rates: IRate[]): Promise<number> {
	try {
		let answerDB = { rowCount: 0 };

		let queryStr = `UPDATE shop SET ratingtariffs = ${rates} ::json[] `;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rowCount;
	} catch (error) {
		console.log("getRatingTariffs", error);
		return 0;
	}
}
