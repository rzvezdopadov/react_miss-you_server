import { PAID_PROPERTY } from "../ipaid";
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
			PAID_PROPERTY.historymessages20,
			historymessages20TariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.historymessages40,
			historymessages40TariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.historymessages60,
			historymessages60TariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.historymessages80,
			historymessages80TariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.historymessages100,
			historymessages100TariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.historymessages200,
			historymessages200TariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.historymessages300,
			historymessages300TariffsData
		);
	} catch (error) {
		console.log(error);
	}
}
