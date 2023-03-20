import { testToken } from "../../auth/token";
import { getAllStickerpacks } from "./stickerpacksDB";
import { getWaySticker } from "./stickerpacksUtils";

export async function queryGetAllStickerpacks(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const stickerpacks = await getAllStickerpacks();

		return res.status(200).json(stickerpacks);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}

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
		let nameFile: string = url.replace("/api/sticker/", "");

		res.setHeader("Cache-Control", "public, max-age=31557600");
		return res.sendFile(getWaySticker(nameFile), {}, function (err) {
			if (err) next();
		});
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}
