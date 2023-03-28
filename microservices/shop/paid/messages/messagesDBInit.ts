import { PAID_PROPERTY } from "../ipaid";
import { insertPaidTariffToDB } from "../paidDB";
import {
	messagesWriteTariffsData,
	messagesReadTariffsData,
} from "./messagesData";

export async function initDBMessages() {
	try {
		await insertPaidTariffToDB(
			PAID_PROPERTY.messageswrite,
			messagesWriteTariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.messagesread,
			messagesReadTariffsData
		);
	} catch (error) {
		console.log(error);
	}
}
