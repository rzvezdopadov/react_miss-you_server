import { insertPaidTariffToDB } from "../paidDB";
import {
	photoload10TariffsData,
	photoload15TariffsData,
	photoload20TariffsData,
	photoload25TariffsData,
	photoload30TariffsData,
} from "./photoData";

export async function initDBPhoto() {
	try {
		await insertPaidTariffToDB("photoload10", photoload10TariffsData);
		await insertPaidTariffToDB("photoload15", photoload15TariffsData);
		await insertPaidTariffToDB("photoload20", photoload20TariffsData);
		await insertPaidTariffToDB("photoload25", photoload25TariffsData);
		await insertPaidTariffToDB("photoload30", photoload30TariffsData);
	} catch (error) {
		console.log(error);
	}
}
