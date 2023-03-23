import {
	getProfileByIdFromDB,
	getProfileCashByIdFromDB,
	getProfileRatingByIdFromDB,
	setProfileCashByIdToDB,
	setProfileRatingByIdToDB,
} from "../../profile/profileDB";
import { getRatingTariffs } from "./ratingDB";
import { testToken } from "../../auth/token";
import {
	answerStatus400,
	answerStatusJWT,
	answerStatusQTDB,
} from "../../../utils/answerstatus";

export async function queryGetRatingTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const ratingtariffs = await getRatingTariffs();

		return res.status(200).json(ratingtariffs);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyRating(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const { idrate } = req.body;
		const ratingtariffs = await getRatingTariffs();
		const posTariff = ratingtariffs.findIndex(
			(value) => value.idRate === idrate
		);

		if (posTariff === -1)
			return answerStatus400(res, "Такого тарифа не существует!");

		let cash = await getProfileCashByIdFromDB(jwtDecode.userId);

		if (cash - ratingtariffs[posTariff].price < 0)
			return answerStatus400(
				res,
				"Недостаточно MY-баллов для покупки, пополните балланс!"
			);

		let rating = await getProfileRatingByIdFromDB(jwtDecode.userId);

		rating += ratingtariffs[posTariff].amountRate;
		cash -= ratingtariffs[posTariff].price;

		await setProfileRatingByIdToDB(jwtDecode.userId, rating);
		await setProfileCashByIdToDB(jwtDecode.userId, cash);

		const profile = await getProfileByIdFromDB(jwtDecode.userId);

		return res.status(200).json(profile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
