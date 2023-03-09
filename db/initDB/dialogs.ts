import { poolDB } from "./config";

export async function initDBDialogs(): Promise<boolean> {
	try {
		const queryStr = `
            CREATE TABLE IF NOT EXISTS dialogs (
                id serial PRIMARY KEY,
                userid1 TEXT,
                userid2 TEXT,
                timecode BIGINT,
                dck TEXT,
                messages JSON[]
            );
        `;

		await poolDB.query(queryStr);

		console.log("initDB Dialogs Ok!");
		return true;
	} catch (error) {
		console.log("initDB Dialogs Error:", error);
		return false;
	}
}
