import { poolDB } from "../../db/config";
import { getUniQueryFromDB } from "../../db/uniquery";

export async function getTariffsShopFromDB(name: string): Promise<any[]> {
	try {
		const answerDB: any[] = (
			await getUniQueryFromDB("shop", ["payload"], [`name = ${name}`])
		)[0].payload;

		return answerDB;
	} catch (error) {
		console.log("getTariffsShopFromDB:", error);
		return undefined;
	}
}

export async function setTariffsShopToDB(
	name: string,
	payload: any[]
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
