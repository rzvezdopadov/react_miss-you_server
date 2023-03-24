import { insertPaidTariffToDB } from "../paidDB";
import {
	historymessages100TariffsData,
	historymessages200TariffsData,
	historymessages20TariffsData,
	historymessages300TariffsData,
	historymessages40TariffsData,
	historymessages60TariffsData,
	historymessages80TariffsData,
} from "./historymessagesData";

export async function initDBHistoryMessages() {
	try {
		await insertPaidTariffToDB(
			"historymessages20",
			historymessages20TariffsData
		);
		await insertPaidTariffToDB(
			"historymessages40",
			historymessages40TariffsData
		);
		await insertPaidTariffToDB(
			"historymessages60",
			historymessages60TariffsData
		);
		await insertPaidTariffToDB(
			"historymessages80",
			historymessages80TariffsData
		);
		await insertPaidTariffToDB(
			"historymessages100",
			historymessages100TariffsData
		);
		await insertPaidTariffToDB(
			"historymessages200",
			historymessages200TariffsData
		);
		await insertPaidTariffToDB(
			"historymessages300",
			historymessages300TariffsData
		);
	} catch (error) {
		console.log(error);
	}
}
