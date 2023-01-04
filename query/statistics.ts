import { poolDB } from "./config";
import { getTimecodeNow } from "../utils/datetime";

interface IStatVisit {
	key: string;
	tco: number;
	tcc: number;
}

interface IStatisticsVisit {
	userid: string;
	visit: Array<IStatVisit>;
}

export async function setVisitByIdToDB(
	key: string,
	userId: string,
	type: "open" | "closed"
): Promise<number> {
	const timecode = getTimecodeNow();

	try {
		const statistics = await getVisitByIdFromDB(userId);

		if (type === "open") {
			const queryStr = "UPDATE users SET visit = $1 WHERE id = $2";

			const statVisit: IStatVisit = {
				key: key,
				tco: timecode,
				tcc: 0,
			};

			statistics.visit.push(statVisit);

			const answerDB = await poolDB.query(queryStr, [
				statistics.visit,
				userId,
			]);

			return answerDB.rowCount;
		} else if (type === "closed") {
			const queryStr = "UPDATE users SET visit = $1 WHERE id = $2";

			const visitPos = statistics.visit.findIndex(
				(value) => value.key === key
			);

			if (visitPos === -1) return 0;

			statistics.visit[visitPos].tcc = timecode;

			const answerDB = await poolDB.query(queryStr, [
				statistics.visit,
				userId,
			]);
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

		let queryStr =
			"SELECT userid, visit::json[] FROM users WHERE userid = $1";

		answerDB = await poolDB.query(queryStr, [userId]);

		return answerDB.rows[0];
	} catch (error) {
		console.log("getVisitByIdFromDB", error);
		return { userid: userId, visit: [] };
	}
}
