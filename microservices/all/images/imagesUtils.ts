import { getRandomString } from "../../../utils/random";
import { IPhotos } from "./iimages";
import { getPhotosByIdFromDB, setPhotosByIdToDB } from "./imagesDB";
const fs = require("fs");

export const deletePhoto = async (
	ourId: string,
	photoPos: number
): Promise<IPhotos> => {
	let photos: IPhotos = {
		photolink: [],
		photomain: 0,
	};

	try {
		photos = await getPhotosByIdFromDB(ourId);

		if (photoPos < photos.photolink.length) {
			const link = photos.photolink[photoPos];
			const nameFile = link.substring(link.length - 34);

			await fs.unlink(
				process.cwd() + "/photos/" + nameFile,
				function (err) {
					if (err) console.log(err);
				}
			);

			photos.photolink.splice(photoPos, 1);

			if (photos.photomain > photos.photolink.length - 1) {
				photos.photomain = photos.photolink.length - 1;
			}
		}

		await setPhotosByIdToDB(ourId, photos);
		photos = await getPhotosByIdFromDB(ourId);

		return photos;
	} catch (error) {
		console.log("deletePhoto", error);
		return undefined;
	}
};

export const checkPhoto = async (
	ourId: string,
	photoPos: number
): Promise<IPhotos> => {
	let photos: IPhotos = {
		photolink: [],
		photomain: 0,
	};

	try {
		photos = await getPhotosByIdFromDB(ourId);

		if (photoPos < photos.photolink.length) {
			photos.photomain = photoPos;
		}

		await setPhotosByIdToDB(ourId, photos);
		photos = await getPhotosByIdFromDB(ourId);

		return photos;
	} catch (error) {
		console.log("checkPhoto", error);
		return undefined;
	}
};

export const addPhoto = async (ourId: string, image: any): Promise<IPhotos> => {
	let photos: IPhotos = {
		photolink: [],
		photomain: 0,
	};

	try {
		photos = await getPhotosByIdFromDB(ourId);

		const strRand = getRandomString(30);

		if (photos.photomain === -1) photos.photomain = 0;

		photos.photolink.push(strRand + ".jpg");
		const setPhotoAnswer = await setPhotosByIdToDB(ourId, photos);

		if (!setPhotoAnswer) return undefined;

		image.mv(process.cwd() + "/photos/" + strRand + ".jpg");

		photos = await getPhotosByIdFromDB(ourId);

		return photos;
	} catch (error) {
		console.log("addPhoto", error);
		return undefined;
	}
};

export const getWayPhoto = (nameFile: string): string => {
	return process.cwd() + "/photos/" + nameFile + ".jpg";
};
