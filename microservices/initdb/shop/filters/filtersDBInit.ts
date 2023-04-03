import { PAID_PROPERTY } from "../../../user/shop/paid/ipaid";
import { insertPaidTariffToDB } from "../../../user/shop/paid/paidDB";
import {
	filtersFavoriteUsersTariffsData,
	filtersVaporsTariffsData,
	longFilterFavoriteUsersTariffsData,
	longFiltersTariffsData,
	longFiltersVaporsTariffsData,
} from "../filters/filtersData";

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
