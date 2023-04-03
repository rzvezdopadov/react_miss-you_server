import { PAID_PROPERTY } from "../../../user/shop/paid/ipaid";
import { insertPaidTariffToDB } from "../../../user/shop/paid/paidDB";
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
