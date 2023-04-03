import { PAID_PROPERTY } from "../../../user/shop/paid/ipaid";
import { insertPaidTariffToDB } from "../../../user/shop/paid/paidDB";
import {
	photoload10TariffsData,
	photoload15TariffsData,
	photoload20TariffsData,
	photoload25TariffsData,
	photoload30TariffsData,
} from "../photo/photoData";

export async function initDBPhoto() {
	try {
		await insertPaidTariffToDB(
			PAID_PROPERTY.photoload10,
			photoload10TariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.photoload15,
			photoload15TariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.photoload20,
			photoload20TariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.photoload25,
			photoload25TariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.photoload30,
			photoload30TariffsData
		);
	} catch (error) {
		console.log(error);
	}
}
