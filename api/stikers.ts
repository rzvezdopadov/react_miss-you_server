import { getWaySticker } from "../utils/stickers";
import { testToken } from "../utils/token";

export async function queryGetSticker(req, res, next) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const { url } = req;
		const nameFile: string = url
			.replace("/api/sticker/", "")
			.replace(".png", "");

		return res.sendFile(getWaySticker(nameFile), {}, function (err) {
			if (err) next();
		});
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}
