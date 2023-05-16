import { poolDB } from "../../../../db/config";
import { getUniQueryFromDB } from "../../../../db/uniquery";
import { getTimedateNow } from "../../../../utils/datetime";
import { IPaid, ITariff, PAID_PROPERTY } from "./ipaid";

export async function getPaidByIdFromDB(ourId: string): Promise<IPaid> {
	try {
		const answerDB: IPaid = (
			await getUniQueryFromDB(`users`, [`paid`], [`userid = '${ourId}'`])
		)[0].paid;

		return answerDB;
	} catch (error) {
		console.log(`${getTimedateNow()} getPaidByIdFromDB: `, error);
		return undefined;
	}
}

export async function setPaidByIdToDB(
	ourId: string,
	paid: IPaid
): Promise<number> {
	try {
		let queryStr = `UPDATE users SET paid = $1 WHERE userid = '${ourId}'`;

		const answerDB = await poolDB.query(queryStr, [paid]);

		return answerDB.rowCount;
	} catch (error) {
		console.log(`${getTimedateNow()} setPaidByIdToDB: `, error);
		return 0;
	}
}

export async function insertPaidTariffToDB(
	paidname: PAID_PROPERTY,
	paidtariff: ITariff[]
): Promise<number> {
	try {
		const paid = await getUniQueryFromDB(
			"shop",
			["name", "payload"],
			[`name = '${paidname}'`]
		);

		if (!paid.length) {
			let strTariffs = "";
			paidtariff.forEach((value) => {
				strTariffs += `'${JSON.stringify(value)}' :: JSON, `;
			});

			strTariffs = strTariffs.slice(0, -2);

			let str = `INSERT INTO public.shop(name, payload) VALUES ('${paidname}', ARRAY [${strTariffs}]);`;

			const answerDB = await poolDB.query(str);

			return answerDB.rowCount;
		}

		return paid.length;
	} catch (error) {
		console.log(`${getTimedateNow()} insertPaidByIdToDB: `, error);
		return 0;
	}
}
