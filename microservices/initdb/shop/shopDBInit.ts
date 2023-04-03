import { poolDB } from "../../../db/config";
import { initDBFilters } from "./filters/filtersDBInit";
import { initDBHistoryMessages } from "./historymessages/historymessagesDBInit";
import { initDBInterests } from "./interests/interestsDBInit";
import { initDBMessages } from "./messages/messagesDBInit";
import { initDBPhoto } from "./photo/photoDBInit";
import { initDBRating } from "./rating/ratingDBInit";

export async function initDBShop(): Promise<boolean> {
	try {
		let queryStr = `
            CREATE TABLE IF NOT EXISTS shop (
                id serial PRIMARY KEY,
				name TEXT, 
                payload JSON[]
            );
        `;

		await poolDB.query(queryStr);

		await initDBRating();
		await initDBFilters();
		await initDBInterests();
		await initDBMessages();
		await initDBPhoto();
		await initDBHistoryMessages();

		console.log("initDB Shop Ok!");
		return true;
	} catch (error) {
		console.log("initDB Shop Error:", error);
		return false;
	}
}
