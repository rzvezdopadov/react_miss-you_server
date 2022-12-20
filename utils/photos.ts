import { IPhotos } from "../interfaces/iprofiles";
import { getPhotosByIdFromDB, setPhotosByIdToDB } from "../query/photos";
import { getRandomString } from "./string";
const fs = require("fs");

export const deletePhoto = async (
	ourId: number,
	photoPos: number
): Promise<IPhotos> => {
	let photos: IPhotos = {
		photolink: [],
		photomain: 0,
	};

	try {
		photos = await getPhotosByIdFromDB(ourId);

		if (photoPos < photos.photolink.length) {
			if (photoPos < photos.photolink.length - 1) {
				photos.photomain = 0;
			}

			const link = photos.photolink[photoPos];
			const nameFile = link.substring(link.length - 34);

			await fs.unlink(__dirname + "/photos/" + nameFile, function (err) {
				if (err) console.log(err);
			});

			photos.photolink.splice(photoPos, 1);
		}

		await setPhotosByIdToDB(ourId, photos);
		photos = await getPhotosByIdFromDB(ourId);

		return photos;
	} catch (error) {
		console.log("deletePhoto", error);
		return photos;
	}
};

export const checkPhoto = async (
	ourId: number,
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
		return photos;
	}
};

export const addPhoto = async (ourId: number, image: any): Promise<IPhotos> => {
	let photos: IPhotos = {
		photolink: [],
		photomain: 0,
	};

	try {
		const strRand = getRandomString(30);

		image.mv(__dirname + "/photos/" + strRand + ".jpg");

		photos = await getPhotosByIdFromDB(ourId);

		if (photos.photolink.length < 10) {
			photos.photolink.push("api/photo/" + strRand + ".jpg");
			await setPhotosByIdToDB(ourId, photos);
		}

		return photos;
	} catch (error) {
		console.log("addPhoto", error);
		return photos;
	}
};

export const getWayPhoto = (nameFile: string): string => {
	return __dirname + "/photos/" + nameFile;
};
