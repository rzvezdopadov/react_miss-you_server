import { IPhotos } from "../interfaces/iprofiles";
import { poolDB } from "./config";

export async function getPhotosByIdFromDB(ourId: string): Promise<IPhotos> {
	try {
		let queryStr =
			"SELECT photolink, photomain FROM users WHERE userid = $1";
		const answerDB = await poolDB.query(queryStr, [ourId]);

		return answerDB.rows[0];
	} catch (error) {
		console.log("getPhotosByIdFromDB", error);
		return {
			photolink: [],
			photomain: 0,
		};
	}
}

export async function setPhotosByIdToDB(
	ourId: string,
	photos: IPhotos
): Promise<number> {
	try {
		let queryStr =
			"UPDATE users SET photolink = $2, photomain = $3 WHERE userid = $1";

		const answerDB = await poolDB.query(queryStr, [
			ourId,
			photos.photolink,
			photos.photomain,
		]);

		return answerDB.rowCount;
	} catch (error) {
		console.log("setPhotosByIdToDB", error);
		return 0;
	}
}
