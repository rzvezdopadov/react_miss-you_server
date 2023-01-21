import { getRatingTariffs } from "../query/shop";
import { testToken } from "../utils/token";

export async function queryGetRatingTariffs(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const ratingtariffs = await getRatingTariffs();

		return res.status(200).json(ratingtariffs);
	} catch (e) {
		res.status(500).json({
			message: "Токен не валидный!",
		});
	}
}
