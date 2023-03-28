import { PAID_PROPERTY } from "../ipaid";
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
		await insertPaidTariffToDB(
			PAID_PROPERTY.longfilters,
			longFiltersTariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.filtersvapors,
			filtersVaporsTariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.longfiltersvapors,
			longFiltersVaporsTariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.filtersfavoriteusers,
			filtersFavoriteUsersTariffsData
		);
		await insertPaidTariffToDB(
			PAID_PROPERTY.longfiltersfavoriteusers,
			longFilterFavoriteUsersTariffsData
		);
	} catch (error) {
		console.log(error);
	}
}
