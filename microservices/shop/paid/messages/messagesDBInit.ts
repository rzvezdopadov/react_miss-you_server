import { insertPaidTariffToDB } from "../paidDB";
import {
	messagesWriteTariffsData,
	messagesReadTariffsData,
} from "./messagesData";

export async function initDBMessages() {
	try {
		await insertPaidTariffToDB("messageswrite", messagesWriteTariffsData);
		await insertPaidTariffToDB("messagesread", messagesReadTariffsData);
	} catch (error) {
		console.log(error);
	}
}
