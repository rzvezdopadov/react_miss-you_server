import {
	getProfileByIdFromDB,
	getProfileCashByIdFromDB,
	getProfileRatingByIdFromDB,
	setProfileCashByIdToDB,
	setProfileRatingByIdToDB,
} from "../query/profile";
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

export async function queryBuyRating(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const { idrate } = req.body;
		const ratingtariffs = await getRatingTariffs();
		const posTariff = ratingtariffs.findIndex(
			(value) => value.idRate === idrate
		);

		if (posTariff === -1)
			return res.status(400).json({
				message: "Такого тарифа не существует!",
			});

		let cash = await getProfileCashByIdFromDB(jwtDecode.userId);

		if (cash - ratingtariffs[posTariff].price < 0)
			return res.status(400).json({
				message:
					"Недостаточно MY-баллов для покупки, пополните балланс!",
			});

		let rating = await getProfileRatingByIdFromDB(jwtDecode.userId);

		rating += ratingtariffs[posTariff].amountRate;
		cash -= ratingtariffs[posTariff].price;

		await setProfileRatingByIdToDB(jwtDecode.userId, rating);
		await setProfileCashByIdToDB(jwtDecode.userId, cash);

		const profile = await getProfileByIdFromDB(jwtDecode.userId);

		return res.status(200).json(profile);
	} catch (e) {
		res.status(500).json({
			message: "Токен не валидный!",
		});
	}
}
