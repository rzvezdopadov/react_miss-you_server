import { addPhoto, checkPhoto, deletePhoto, getWayPhoto } from "./imagesUtils";
import { testToken } from "../auth/token";

export async function queryLoadPhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		let { image } = req.files;

		if (!image)
			return res.status(400).json({
				message: "Изображение не распознано!",
			});

		const photos = await addPhoto(jwtDecode.userId, image);

		return res.status(200).json(photos);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}

export async function queryDeletePhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		let { photoPos } = req.body;
		photoPos = Number(photoPos);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const photos = await deletePhoto(jwtDecode.userId, photoPos);

		return res.status(200).json(photos);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}

export async function queryCheckPhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		let { photoPos } = req.body;
		photoPos = Number(photoPos);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const photos = await checkPhoto(jwtDecode.userId, photoPos);

		return res.status(200).json(photos);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}

export async function queryGetPhoto(req, res, next) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		let { url } = req;
		const nameFile = url.replace("/api/photo/", "").replace(".jpg", "");

		res.setHeader("Cache-Control", "public, max-age=31557600");
		return res.sendFile(getWayPhoto(nameFile), {}, function (err) {
			if (err) next();
		});
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}
