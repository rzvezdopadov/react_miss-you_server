import { poolDB } from "../../../db/config";
import { getTimedateNow } from "../../../utils/datetime";
import { IPhotos } from "./iimages";

export async function getPhotosByIdFromDB(ourId: string): Promise<IPhotos> {
	try {
		const queryStr = `SELECT photolink, photomain FROM users WHERE userid = '${ourId}'`;
		const answerDB = await poolDB.query(queryStr);

		return answerDB.rows[0];
	} catch (error) {
		console.log(`${getTimedateNow()} getPhotosByIdFromDB: `, error);
		return undefined;
	}
}

export async function setPhotosByIdToDB(
	ourId: string,
	photos: IPhotos
): Promise<number> {
	try {
		let queryStr =
			`UPDATE users SET ` +
			`photolink = $1, ` +
			`photomain = ${photos.photomain} ` +
			`WHERE userid = '${ourId}'`;

		const answerDB = await poolDB.query(queryStr, [photos.photolink]);

		return answerDB.rowCount;
	} catch (error) {
		console.log(`${getTimedateNow()} setPhotosByIdToDB: `, error);
		return 0;
	}
}
