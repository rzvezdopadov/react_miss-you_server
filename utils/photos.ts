import { IPhotos } from "../interfaces/iprofiles";
import { getPhotosByIdFromDB, setPhotosByIdToDB } from "../query/photos";

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

		console.log("photoPos", photoPos);

		if (photoPos < photos.photolink.length) {
			if (photoPos < photos.photolink.length) {
				photos.photomain = 0;
			}

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

export const addPhoto = async (
	ourId: number,
	photoLink: string
): Promise<IPhotos> => {
	let photos: IPhotos = {
		photolink: [],
		photomain: 0,
	};

	try {
		photos = await getPhotosByIdFromDB(ourId);

		console.log("addPhoto", photos);
	} catch (error) {
		console.log("addPhoto", error);
		return photos;
	}
};
