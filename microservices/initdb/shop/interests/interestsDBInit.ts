import { PAID_PROPERTY } from "../../../user/shop/paid/ipaid";
import { insertPaidTariffToDB } from "../../../user/shop/paid/paidDB";
import {
	interests20TariffsData,
	interests30TariffsData,
} from "./interestsData";

export async function initDBInterests() {
	try {
		await insertPaidTariffToDB(
			PAID_PROPERTY.interests20,
			interests20TariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.interests30,
			interests30TariffsData
		);
	} catch (error) {
		console.log(error);
	}
}
