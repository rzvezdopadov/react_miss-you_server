import { poolDB } from "../../../db/config";

export async function initDBTransactions(): Promise<boolean> {
	try {
		const queryStr = `
            CREATE TABLE IF NOT EXISTS transactions (
                id serial PRIMARY KEY,
                userid TEXT,
                timecode BIGINT,
				userfrom TEXT, 
				idtrans TEXT,
                nametariff TEXT,
				idtariff TEXT,
				cash INT,
				discription TEXT
            )
        `;

		await poolDB.query(queryStr);

		console.log("initDB Transactions Ok!");
		return true;
	} catch (error) {
		console.log("initDB Transactions Error:", error);
		return false;
	}
}
