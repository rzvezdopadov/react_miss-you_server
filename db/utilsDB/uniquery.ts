import { poolDB } from "../initDB/config";

export enum WHERETYPE {
	and = "AND",
	or = "OR",
}

export async function getUniQueryFromDB(
	table: string = "",
	select: string[] = [],
	where: string[] = [],
	wheretype: WHERETYPE = WHERETYPE.and
): Promise<any[]> {
	if (!table || select.length === 0) return undefined;

	try {
		let queryStr = "SELECT ";

		for (let i = 0; i < select.length; i++) {
			queryStr += `${select[i]}, `;
		}

		queryStr = queryStr.slice(0, -2);

		queryStr += ` FROM ${table} `;

		if (where.length !== 0) {
			queryStr += `WHERE `;

			for (let i = 0; i < where.length; i++) {
				if (wheretype === WHERETYPE.and) {
					queryStr += `(${where[i]}) AND `;
				} else if (wheretype === WHERETYPE.or) {
					queryStr += `(${where[i]}) OR `;
				}
			}

			if (wheretype === WHERETYPE.and) {
				queryStr = queryStr.slice(0, -4);
			} else if (wheretype === WHERETYPE.or) {
				queryStr = queryStr.slice(0, -3);
			}
		}

		queryStr = `${queryStr.slice(0, -1)};`;

		let answerDB = { rows: [] };

		answerDB = await poolDB.query(queryStr);

		const rows = answerDB.rows;

		return rows;
	} catch (error) {
		console.log("getUniQueryFromDB", error);
		return undefined;
	}
}
