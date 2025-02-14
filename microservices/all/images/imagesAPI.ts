import { addPhoto, checkPhoto, deletePhoto, getWayPhoto } from "./imagesUtils";
import { testToken } from "../auth/token";
import { getPhotosByIdFromDB } from "./imagesDB";
import {
	answerStatusFailJWT,
	answerStatus400,
	answerStatusQTDB,
} from "../../../utils/answerstatus";
import { getTimecodeNow } from "../../../utils/datetime";
import { getPaidByIdFromDB } from "../../user/shop/paid/paidDB";
import { normalizeNumber, normalizeString } from "../../../utils/normalize";

export async function queryLoadPhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		let { image } = req.files;

		if (!image) return answerStatus400(res, "Изображение не распознано!");

		let photos = await getPhotosByIdFromDB(jwtDecode.userId);
		const userIdPaid = await getPaidByIdFromDB(jwtDecode.userId);
		const timecode = getTimecodeNow();

		const overflowPhotoPhrase =
			"Больше фото загрузить нельзя, купите дополнительные опции!";

		if (userIdPaid.photoload30.timecode > timecode) {
			if (photos.photolink.length + 1 > 30)
				return answerStatus400(res, "Больше фото загрузить нельзя!");
		} else if (userIdPaid.photoload25.timecode > timecode) {
			if (photos.photolink.length + 1 > 25)
				return answerStatus400(res, overflowPhotoPhrase);
		} else if (userIdPaid.photoload20.timecode > timecode) {
			if (photos.photolink.length + 1 > 20)
				return answerStatus400(res, overflowPhotoPhrase);
		} else if (userIdPaid.photoload15.timecode > timecode) {
			if (photos.photolink.length + 1 > 15)
				return answerStatus400(res, overflowPhotoPhrase);
		} else if (userIdPaid.photoload10.timecode > timecode) {
			if (photos.photolink.length + 1 > 10)
				return answerStatus400(res, overflowPhotoPhrase);
		} else if (photos.photolink.length + 1 > 5) {
			return answerStatus400(res, overflowPhotoPhrase);
		}

		photos = await addPhoto(jwtDecode.userId, image);

		return res.status(200).json(photos);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryDeletePhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		let { photoPos } = req.body;
		photoPos = normalizeNumber(photoPos);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const photos = await deletePhoto(jwtDecode.userId, photoPos);

		return res.status(200).json(photos);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryCheckPhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		let { photoPos } = req.body;
		photoPos = normalizeNumber(photoPos);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const photos = await checkPhoto(jwtDecode.userId, photoPos);

		return res.status(200).json(photos);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetPhoto(req, res, next) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		let { url } = req;
		const nameFile = url.replace("/api/photo/", "").replace(".jpg", "");

		res.setHeader("Cache-Control", "public, max-age=31557600");
		return res.sendFile(getWayPhoto(nameFile), {}, (error) => {
			if (error) next();
		});
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
