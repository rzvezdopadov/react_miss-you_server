import { poolDB } from "../query/config";

export async function initDBComplaints(): Promise<boolean> {
	try {
		const queryStr = `
            CREATE TABLE IF NOT EXISTS complaints (
                id serial PRIMARY KEY,
                userfrom TEXT,
                userto TEXT,
                timecode BIGINT,
                dck TEXT,
                status TEXT,
                messages JSON[],
                complmessages JSON[]
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
