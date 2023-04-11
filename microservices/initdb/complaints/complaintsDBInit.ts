import { poolDB } from "../../../db/config";

export async function initDBComplaints(): Promise<boolean> {
	try {
		const queryStr = `
            CREATE TABLE IF NOT EXISTS complaints (
                id serial PRIMARY KEY,
                userfrom TEXT,
                userto TEXT,
                timecode BIGINT,
                type TEXT,
                subject TEXT,
                discription TEXT,
                cash INT,
                dck TEXT,
                status TEXT,
                complmessage JSON
            );
        `;

		await poolDB.query(queryStr);

		console.log("initDB Complaints Ok!");
		return true;
	} catch (error) {
		console.log("initDB Complaints Error:", error);
		return false;
	}
}
