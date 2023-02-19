import { poolDB } from "./config";
import { getTimecodeNow } from "../utils/datetime";
import { IStatVisit, IStatisticsVisit } from "../interfaces/iprofiles";

export async function setVisitByIdToDB(
	key: string,
	userId: string,
	type: "open" | "closed"
): Promise<number> {
	const timecode = getTimecodeNow();

	try {
		const statistics = await getVisitByIdFromDB(userId);

		if (type === "open") {
			const statVisit: IStatVisit = {
				key: key,
				tco: timecode,
				tcc: 0,
			};

			statistics.visit.push(statVisit);

			const queryStr =
				`UPDATE users SET ` +
				`visit = $1 ` +
				`WHERE userid = '${userId}'`;

			const answerDB = await poolDB.query(queryStr, [statistics.visit]);

			return answerDB.rowCount;
		} else if (type === "closed") {
			const visitPos = statistics.visit.findIndex(
				(value) => value.key === key
			);

			if (visitPos === -1) return 0;

			statistics.visit[visitPos].tcc = timecode;

			const queryStr =
				`UPDATE users ` +
				`SET visit = $1 :: JSON[] ` +
				`WHERE userid = '${userId}'`;

			const answerDB = await poolDB.query(queryStr, [statistics.visit]);
			return answerDB.rowCount;
		}
	} catch (error) {
		console.log("setVisitByIdToDB", error);
		return 0;
	}
}

export async function getVisitByIdFromDB(
	userId: string
): Promise<IStatisticsVisit> {
	try {
		let answerDB = { rows: [] };

		let queryStr = `SELECT userid, visit::json[] FROM users WHERE userid = '${userId}'`;

		answerDB = await poolDB.query(queryStr);

		return answerDB.rows[0];
	} catch (error) {
		console.log("getVisitByIdFromDB", error);
		return undefined;
	}
}
