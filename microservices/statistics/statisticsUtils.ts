import { getTimecodeNow } from "../../utils/datetime";
import { IStatVisit } from "./istatistics";
import { getVisitByIdFromDB, setVisitByIdToDB } from "./statisticsDB";

export async function setVisitById(
	key: string,
	userId: string,
	type: SOCKET_TYPE_OC
): Promise<number> {
	const timecode = getTimecodeNow();

	try {
		const statistics = await getVisitByIdFromDB(userId);

		if (type === SOCKET_TYPE_OC.open) {
			const statVisit: IStatVisit = {
				key: key,
				tco: timecode,
				tcc: 0,
			};

			statistics.visit.push(statVisit);
		} else if (type === SOCKET_TYPE_OC.closed) {
			const visitPos = statistics.visit.findIndex(
				(visit) => visit.key === key
			);

			if (visitPos === -1) return 0;

			statistics.visit[visitPos].tcc = timecode;
		}

		const answerDB = await setVisitByIdToDB(statistics);

		return answerDB;
	} catch (error) {
		console.log("setVisitById", error);

		return 0;
	}
}
