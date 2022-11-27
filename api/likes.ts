import { testToken } from "../utils/token";
import { setLikesById } from "../utils/likes";

export async function querySetLike(req, res) {
	try {
		let { id } = req.body;
		id = Number(id);

		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const likes = await setLikesById(jwtDecode.userId, id);

		return res.status(200).json(likes);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}
