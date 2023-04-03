import { poolDB } from "../../../db/config";
import { getUniQueryFromDB } from "../../../db/uniquery";
import { SHOP_TARIFFS } from "./ishop";
import { ITariff, PAID_PROPERTY } from "./paid/ipaid";

export async function getTariffsShopFromDB(
	name: PAID_PROPERTY | SHOP_TARIFFS
): Promise<ITariff[]> {
	try {
		const answerDB: any[] = (
			await getUniQueryFromDB("shop", ["payload"], [`name = '${name}'`])
		)[0].payload;

		return answerDB;
	} catch (error) {
		console.log("getTariffsShopFromDB:", error);
		return undefined;
	}
}

export async function setTariffsShopToDB(
	name: PAID_PROPERTY | SHOP_TARIFFS,
	payload: ITariff[]
): Promise<number> {
	try {
		let answerDB = { rowCount: 0 };

		let queryStr = `UPDATE shop SET payload = ${payload} ::json[] WHERE name = ${name}`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rowCount;
	} catch (error) {
		console.log("setTariffsShopToDB:", error);
		return 0;
	}
}
