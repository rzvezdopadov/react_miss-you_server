import { addPhoto, checkPhoto, deletePhoto, getWayPhoto } from "./imagesUtils";
import { testToken } from "../auth/token";
import {
	answerStatus400,
	answerStatusJWT,
	answerStatusQTDB,
} from "../../utils/answerstatus";

export async function queryLoadPhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		let { image } = req.files;

		if (!image) return answerStatus400(res, "Изображение не распознано!");

		const photos = await addPhoto(jwtDecode.userId, image);

		return res.status(200).json(photos);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryDeletePhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		let { photoPos } = req.body;
		photoPos = Number(photoPos);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const photos = await deletePhoto(jwtDecode.userId, photoPos);

		return res.status(200).json(photos);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryCheckPhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		let { photoPos } = req.body;
		photoPos = Number(photoPos);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const photos = await checkPhoto(jwtDecode.userId, photoPos);

		return res.status(200).json(photos);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetPhoto(req, res, next) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

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
