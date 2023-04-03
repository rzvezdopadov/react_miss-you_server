import { poolDB } from "../../../../db/config";
import { getUniQueryFromDB } from "../../../../db/uniquery";
import { ratingTariffsData } from "./ratingData";

export async function initDBRating(): Promise<boolean> {
	try {
		const rating = await getUniQueryFromDB(
			"shop",
			["name", "payload"],
			["name = 'rating'"]
		);

		if (!rating.length) {
			let strTariffs = "";
			ratingTariffsData.forEach((value) => {
				strTariffs += `'${JSON.stringify(value)}' :: JSON, `;
			});

			strTariffs = strTariffs.slice(0, -2);

			let str = `INSERT INTO public.shop(name, payload) VALUES ('rating', ARRAY [${strTariffs}]);`;

			const answerDB = await poolDB.query(str);

			if (!answerDB.rowCount) return false;
		}

		return true;
	} catch (error) {
		console.log("initDBRating", error);

		return false;
	}
}
