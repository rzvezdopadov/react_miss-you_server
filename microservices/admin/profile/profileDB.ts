import {
	IAdminBanned,
	IAdminStatVisit,
	IQueryGetAdminProfiles,
} from "./iprofile";
import { IProfile } from "../../user/profile/iprofile";
import { getTimedateNow, getYearFromAge } from "../../../utils/datetime";
import { conditionStr } from "../../../utils/query";
import { poolDB } from "../../../db/config";
import { fieldProfileShort } from "../../user/profile/profileDB";
import { ACCTYPE } from "../../role/role";

export async function getAdminAcctypeByIdFromDB(
	userId: string
): Promise<ACCTYPE> {
	try {
		const queryStr = `SELECT acctype FROM users WHERE userid = '${userId}'`;
		const answerDB = await poolDB.query(queryStr);
		const { acctype } = answerDB.rows[0];

		return acctype;
	} catch (error) {
		console.log(`${getTimedateNow()} getAdminAcctypeByIdFromDB: `, error);
		return ACCTYPE.user;
	}
}

export async function setAdminAcctypeByIdToDB(
	userId: string,
	acctype: ACCTYPE
): Promise<number> {
	try {
		const queryStr = `UPDATE users SET acctype = '${acctype}' WHERE userid = '${userId}'`;
		const answerDB = await poolDB.query(queryStr);

		return answerDB.rowCount;
	} catch (error) {
		console.log(`${getTimedateNow()} getAdminAcctypeByIdFromDB: `, error);
		return 0;
	}
}

export async function getAdminStatVisitByIdFromDB(
	userId?: string
): Promise<IAdminStatVisit[]> {
	try {
		let queryStr = `SELECT userid, visit FROM users WHERE userid = '${userId}'`;

		if (!userId) {
			queryStr = `SELECT userid, visit FROM users`;
		}

		const answerDB = await poolDB.query(queryStr);

		return answerDB.rows;
	} catch (error) {
		console.log(`${getTimedateNow()} getAdminStatVisitByIdFromDB: `, error);
		return [];
	}
}

export async function getAdminBannedByIdFromDB(
	userId: string
): Promise<IAdminBanned> {
	try {
		const queryStr = `SELECT banned FROM users WHERE userid = '${userId}'`;
		const answerDB = await poolDB.query(queryStr);

		const { banned } = answerDB.rows[0];

		return banned;
	} catch (error) {
		console.log(`${getTimedateNow()} getAdminBannedByIdFromDB: `, error);
		return { timecode: 0, whobanned: "", discription: "" };
	}
}

export async function setAdminBannedByIdToDB(
	userId: string,
	banned: IAdminBanned
): Promise<number> {
	try {
		const queryStr = `UPDATE users SET banned = $1 WHERE userid = '${userId}'`;
		const answerDB = await poolDB.query(queryStr, [banned]);

		return answerDB.rowCount;
	} catch (error) {
		console.log(`${getTimedateNow()} setAdminBannedByIdToDB: `, error);
		return 0;
	}
}

export async function getAdminProfiles(
	QueryGetProfiles: IQueryGetAdminProfiles
): Promise<IProfile[]> {
	const startPos = Number(QueryGetProfiles.startcount);
	const endPos = startPos + Number(QueryGetProfiles.amount);
	const { filters } = QueryGetProfiles;

	try {
		let answerDB = { rows: [] };

		let queryStr = `SELECT ${fieldProfileShort} FROM users WHERE `;

		if (filters.acctype === ACCTYPE.admin) {
			queryStr += `acctype = '${ACCTYPE.admin}'`;
			answerDB = await poolDB.query(queryStr);
		} else if (filters.userid) {
			queryStr += `userid ~ '${filters.userid}'`;
			answerDB = await poolDB.query(queryStr);
		} else {
			for (let key in filters)
				if (filters[key] === null) filters[key] = 0;

			queryStr += `(location = '${filters.location}') AND `;
			queryStr += `(yearofbirth >= ${getYearFromAge(
				filters.ageend
			)}) AND (yearofbirth <= ${getYearFromAge(filters.agestart)}) AND `;
			queryStr += `(growth >= ${filters.growthstart}) AND (growth <= ${filters.growthend}) AND `;
			queryStr += conditionStr("weight", filters.weight);
			queryStr += conditionStr("signzodiac", filters.signzodiac);
			queryStr += `gender = ${filters.gender} AND `;
			queryStr += `gendervapor = '${filters.gendervapor}' AND `;
			queryStr += conditionStr("education", filters.education);
			queryStr += conditionStr(
				"fieldofactivity",
				filters.fieldofactivity
			);
			queryStr += conditionStr("maritalstatus", filters.maritalstatus);
			queryStr += conditionStr("children", filters.children);
			queryStr += conditionStr("religion", filters.religion);
			queryStr += conditionStr("smoke", filters.smoke);
			queryStr += conditionStr("alcohol", filters.alcohol);
			queryStr += conditionStr("profit", filters.profit);

			queryStr = queryStr.slice(0, -5);

			answerDB = await poolDB.query(queryStr);
		}

		let profiles: IProfile[] = answerDB.rows;

		if (profiles.length > 1) {
			let newProfiles = profiles.sort((a, b) => b.rating - a.rating);

			if (startPos - endPos) {
				newProfiles = newProfiles.slice(startPos, endPos);
			}

			profiles = newProfiles;
		}

		return profiles;
	} catch (error) {
		console.log(`${getTimedateNow()} getAdminProfiles `, error);
		return [];
	}
}
