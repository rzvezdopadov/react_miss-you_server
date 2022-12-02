import { deletePhoto } from "../utils/photos";
import { testToken } from "../utils/token";

export async function queryLoadPhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		let { id } = req.query;
		id = Number(id);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});
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
