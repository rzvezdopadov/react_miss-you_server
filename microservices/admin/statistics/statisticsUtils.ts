import { getTimecodeNow } from "../../../utils/datetime";
import { SOCKET_TYPE_OC } from "../../sockets/isocket";
import { IStatVisit } from "./istatistics";
import { getVisitByIdFromDB, setVisitByIdToDB } from "./statisticsDB";

export async function setVisitById(
	key: string,
	userId: string,
	type: SOCKET_TYPE_OC
): Promise<number> {
	const timecode = getTimecodeNow();

	try {
		const statVisit: IStatVisit = {
			userid: userId,
			key: key,
			tco: timecode,
			tcc: 0,
		};

		if (type === SOCKET_TYPE_OC.closed) {
			statVisit.tcc = timecode;
		}

		const answerDB = await setVisitByIdToDB(statVisit);

		return answerDB;
	} catch (error) {
		console.log("setVisitById", error);

		return 0;
	}
}
