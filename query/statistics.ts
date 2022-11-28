import { poolDB } from "./config";
import { getTimecodeNow } from "../utils/datetime";

interface IStatVisit {
	key: string;
	timecodeopen: number;
	timecodeclosed: number;
}

interface IStatisticsVisit {
	id: number;
	visit: Array<IStatVisit>;
}

export async function setVisitByIdToDB(
	key: string,
	userId: number,
	type: "open" | "closed"
): Promise<number> {
	const timecode = getTimecodeNow();

	try {
		const statistics = await getVisitByIdFromDB(userId);

		if (type === "open") {
			const queryStr =
				"UPDATE users_statistics SET visit = $1 WHERE id = $2";

			const statVisit: IStatVisit = {
				key: key,
				timecodeopen: timecode,
				timecodeclosed: 0,
			};

			statistics.visit.push(statVisit);

			const answerDB = await poolDB.query(queryStr, [
				statistics.visit,
				userId,
			]);

			return answerDB.rowCount;
		} else if (type === "closed") {
			const queryStr =
				"UPDATE users_statistics SET visit = $1 WHERE id = $2";

			const visitPos = statistics.visit.findIndex(
				(value) => value.key === key
			);

			if (visitPos === -1) return 0;

			statistics.visit[visitPos].timecodeclosed = timecode;

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
	userId: number
): Promise<IStatisticsVisit> {
	try {
		let answerDB = { rows: [] };

		let queryStr =
			"SELECT id, visit::json[] FROM users_statistics WHERE id = $1";

		answerDB = await poolDB.query(queryStr, [userId]);

		return answerDB.rows[0];
	} catch (error) {
		console.log("getVisitByIdFromDB", error);
		return { id: userId, visit: [] };
	}
}
