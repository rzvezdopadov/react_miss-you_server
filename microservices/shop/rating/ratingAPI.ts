import {
	getProfileByIdFromDB,
	getProfileCashByIdFromDB,
	getProfileRatingByIdFromDB,
	setProfileCashByIdToDB,
	setProfileRatingByIdToDB,
} from "../../profile/profileDB";
import { testToken } from "../../auth/token";
import {
	answerStatus400,
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../utils/answerstatus";
import { getTariffsShopFromDB } from "../shopDB";
import { IRate } from "./irating";

export async function queryGetRatingTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const ratingtariffs = await getTariffsShopFromDB("ratingtariffs");

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

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;
		const ratingtariffs: IRate[] = await getTariffsShopFromDB(
			"ratingtariffs"
		);
		const posTariff = ratingtariffs.findIndex(
			(value) => value.idTariff === idtariff
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
