import { poolDB } from "../query/config";
import { ratingTariffsData } from "./shopData";

const shopRatingGenerate = (): string => {
	let strTariffs = "";
	ratingTariffsData.forEach((value) => {
		strTariffs += `'${JSON.stringify(value)}' :: JSON, `;
	});
	strTariffs = strTariffs.slice(0, -2);

	let str = `INSERT INTO public.shop(ratingtariffs) VALUES (ARRAY [${strTariffs}]);`;
	return str;
};

export async function initDBShopInit(): Promise<boolean> {
	try {
		let queryStr = `
            CREATE TABLE IF NOT EXISTS shop (
                id serial PRIMARY KEY,
                ratingtariffs JSON[]
            );
        `;

		await poolDB.query(queryStr);

		queryStr = `SELECT ratingtariffs FROM shop`;

		const answerDB = await poolDB.query(queryStr);

		if (!answerDB.rows[0]) {
			queryStr = shopRatingGenerate();

			await poolDB.query(queryStr);
		}

		console.log("dbShopInit Ok!");
		return true;
	} catch (error) {
		console.log("dbShopInit Error:", error);
		return false;
	}
}
