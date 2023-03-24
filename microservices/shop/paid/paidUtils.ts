import { answerStatus400, answerStatusQTDB } from "../../../utils/answerstatus";
import { TIMECODE_DAY, getTimecodeNow } from "../../../utils/datetime";
import {
	getProfileByIdFromDB,
	getProfileCashByIdFromDB,
	setProfileCashByIdToDB,
} from "../../profile/profileDB";
import { getTariffsShopFromDB } from "../shopDB";
import { ITariff } from "./ipaid";
import { getPaidByIdFromDB, setPaidByIdToDB } from "./paidDB";

export async function queryPaidNext(
	res: any,
	nameTariff: string,
	idTariff: string,
	userId: string
) {
	try {
		const tariff: ITariff[] = await getTariffsShopFromDB(nameTariff);
		const posTariff = tariff.findIndex(
			(value) => value.idTariff === idTariff
		);

		if (posTariff === -1) {
			answerStatus400(res, "Такого тарифа не существует!");

			return false;
		}

		let cash = await getProfileCashByIdFromDB(userId);

		if (cash - tariff[posTariff].price < 0) {
			answerStatus400(
				res,
				"Недостаточно MY-баллов для покупки, пополните балланс!"
			);
			return false;
		}

		let paid = await getPaidByIdFromDB(userId);

		paid[nameTariff].timecode =
			getTimecodeNow() + tariff[posTariff].amountDay * TIMECODE_DAY;
		paid[nameTariff] = paid[nameTariff].enabled = true;
		cash -= tariff[posTariff].price;

		await setPaidByIdToDB(userId, paid);
		await setProfileCashByIdToDB(userId, cash);

		const profile = await getProfileByIdFromDB(userId);

		res.status(200).json(profile);

		return true;
	} catch (error) {
		answerStatusQTDB(res, error);

		return false;
	}
}
