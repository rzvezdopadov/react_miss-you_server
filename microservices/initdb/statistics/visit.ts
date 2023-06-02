import { poolDB } from "../../../db/config";

export async function initDBVisit(): Promise<boolean> {
	try {
		let queryStr = `
            CREATE TABLE IF NOT EXISTS visit (
                id serial PRIMARY KEY,
                userid TEXT,
                key TEXT,
                tco BIGINT,
                tcc BIGINT
            );
        `;

		await poolDB.query(queryStr);

		queryStr = `DELETE FROM visit WHERE tcc = ${0}`;
		await poolDB.query(queryStr);

		console.log("initDB Visit Ok!");
		return true;
	} catch (error) {
		console.log("initDB Visit Error:", error);
		return false;
	}
}
