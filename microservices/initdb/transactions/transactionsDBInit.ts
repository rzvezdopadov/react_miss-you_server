import { poolDB } from "../../../db/config";

export async function initDBTransactions(): Promise<boolean> {
	try {
		const queryStr = `
            CREATE TABLE IF NOT EXISTS transactions (
                id serial PRIMARY KEY,
                userid TEXT,
                timecode BIGINT,
                transaction JSON
            );
        `;

		await poolDB.query(queryStr);

		console.log("initDB Transactions Ok!");
		return true;
	} catch (error) {
		console.log("initDB Transactions Error:", error);
		return false;
	}
}
