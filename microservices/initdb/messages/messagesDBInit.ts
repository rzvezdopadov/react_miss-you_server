import { poolDB } from "../../../db/config";

export async function initDBMessages(): Promise<boolean> {
	try {
		const queryStr = `
            CREATE TABLE IF NOT EXISTS messages (
                id serial PRIMARY KEY,
                timecode BIGINT,
                id1 TEXT,
                id2 TEXT,
                id1del BOOLEAN,
                id2del BOOLEAN,
                id1rd BOOLEAN,
                id2rd BOOLEAN,
                dck TEXT,
                type INTEGER,
                msg TEXT,
                spkid TEXT,
                spos INTEGER
            );
        `;

		await poolDB.query(queryStr);

		console.log("initDB Messages Ok!");
		return true;
	} catch (error) {
		console.log("initDB Messages Error:", error);
		return false;
	}
}
