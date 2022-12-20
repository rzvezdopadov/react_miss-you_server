import { getPhotosByIdFromDB, setPhotosByIdToDB } from "../query/photos";
import { checkPhoto, deletePhoto } from "../utils/photos";
import { getRandomString } from "../utils/string";
import { testToken } from "../utils/token";

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

		const strRand = getRandomString(30);

		image.mv(__dirname + "/photos/" + strRand + ".jpg");

		const photos = await getPhotosByIdFromDB(jwtDecode.userId);
		photos.photolink.push("api/photo/" + strRand + ".jpg");
		await setPhotosByIdToDB(jwtDecode.userId, photos);

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

export async function queryGetPhoto(req, res) {
	try {
		console.log("queryGetPhoto");
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		let { url } = req;
		const nameFile = url.substring(url.length - 34);

		console.log(nameFile);

		return res.sendFile(__dirname + "/photos/" + nameFile);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}
