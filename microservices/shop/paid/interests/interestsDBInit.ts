import { insertPaidTariffToDB } from "../paidDB";
import {
	interests20TariffsData,
	interests30TariffsData,
} from "./interestsData";

export async function initDBInterests() {
	try {
		await insertPaidTariffToDB("interests20", interests20TariffsData);
		await insertPaidTariffToDB("interests30", interests30TariffsData);
	} catch (error) {
		console.log(error);
	}
}
