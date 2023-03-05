import { poolDB } from "./config";
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

export async function initDBShop(): Promise<boolean> {
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

		console.log("initDB Shop Ok!");
		return true;
	} catch (error) {
		console.log("initDB Shop Error:", error);
		return false;
	}
}
