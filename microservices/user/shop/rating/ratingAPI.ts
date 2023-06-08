import {
	getProfileByIdFromDB,
	getProfileCashByIdFromDB,
	getProfileRatingByIdFromDB,
	setProfileCashByIdToDB,
	setProfileRatingByIdToDB,
} from "../../profile/profileDB";
import { getTariffsShopFromDB } from "../shopDB";
import { SHOP_TARIFFS } from "../ishop";
import { ITariff } from "../paid/ipaid";
import {
	answerStatusFailJWT,
	answerStatusQTDB,
	answerStatus400,
} from "../../../../utils/answerstatus";
import { testToken } from "../../../all/auth/token";
import { normalizeString } from "../../../../utils/normalize";
import { ITransUserFrom, ITransaction } from "../transactions/itransactions";
import { getTimecodeNow } from "../../../../utils/datetime";
import { getRandomString } from "../../../../utils/random";
import { getPaidDiscription } from "../transactions/transactionsUtils";
import { setTransactionToDB } from "../transactions/transactionsDB";

export async function queryGetRatingTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const ratingtariffs = await getTariffsShopFromDB(SHOP_TARIFFS.rating);

		return res.status(200).json(ratingtariffs);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyRating(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;
		const ratingtariffs: ITariff[] = await getTariffsShopFromDB(
			SHOP_TARIFFS.rating
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

		const trans: ITransaction = {
			userid: jwtDecode.userId,
			timecode: getTimecodeNow(),
			userfrom: ITransUserFrom.system,
			idtrans: getRandomString(20),
			nametariff: SHOP_TARIFFS.rating,
			idtariff: idtariff,
			cash: -1 * ratingtariffs[posTariff].price,
			discription: `Покупка баллов ${getPaidDiscription(
				SHOP_TARIFFS.rating
			)} +${ratingtariffs[posTariff].amountRate}`,
		};

		await setTransactionToDB(trans);

		return res.status(200).json(profile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
