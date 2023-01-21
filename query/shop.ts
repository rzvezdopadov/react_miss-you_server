import { IRate } from "../interfaces/ishop";
import { poolDB } from "./config";

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

export async function setRatingTariffs(Rates: IRate[]): Promise<IRate[]> {
	try {
		let answerDB = { rows: [] };

		let queryStr = "UPDATE shop SET ratingtariffs = $1 ::json[] ";

		answerDB = await poolDB.query(queryStr, [Rates]);

		return answerDB.rows[0];
	} catch (error) {
		console.log("getRatingTariffs", error);
		return [];
	}
}
