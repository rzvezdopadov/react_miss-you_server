import { insertPaidTariffToDB } from "../paidDB";
import {
	filtersFavoriteUsersTariffsData,
	filtersVaporsTariffsData,
	longFilterFavoriteUsersTariffsData,
	longFiltersTariffsData,
	longFiltersVaporsTariffsData,
} from "./filtersData";

export async function initDBFilters() {
	try {
		await insertPaidTariffToDB("longfilters", longFiltersTariffsData);
		await insertPaidTariffToDB("filtersvapors", filtersVaporsTariffsData);
		await insertPaidTariffToDB(
			"longfiltersvapors",
			longFiltersVaporsTariffsData
		);
		await insertPaidTariffToDB(
			"filtersfavoriteusers",
			filtersFavoriteUsersTariffsData
		);
		await insertPaidTariffToDB(
			"longfilterfavoriteusers",
			longFilterFavoriteUsersTariffsData
		);
	} catch (error) {
		console.log(error);
	}
}
