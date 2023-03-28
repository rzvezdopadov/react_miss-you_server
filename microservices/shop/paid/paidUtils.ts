import { answerStatus400, answerStatusQTDB } from "../../../utils/answerstatus";
import { TIMECODE_DAY, getTimecodeNow } from "../../../utils/datetime";
import {
	getProfileByIdFromDB,
	getProfileCashByIdFromDB,
	setProfileCashByIdToDB,
} from "../../profile/profileDB";
import { getTariffsShopFromDB } from "../shopDB";
import { IPaid, ITariff, PAID_PROPERTY } from "./ipaid";
import { getPaidByIdFromDB, setPaidByIdToDB } from "./paidDB";

export function testPaidOnOverflow(paid: IPaid): IPaid {
	const timecode = getTimecodeNow();

	if (paid.messageswrite?.timecode < timecode)
		paid.messageswrite.enabled = false;
	if (paid.messagesread?.timecode < timecode)
		paid.messagesread.enabled = false;
	if (paid.longfilters?.timecode < timecode) paid.longfilters.enabled = false;
	if (paid.filtersvapors?.timecode < timecode)
		paid.filtersvapors.enabled = false;
	if (paid.longfiltersvapors?.timecode < timecode)
		paid.longfiltersvapors.enabled = false;
	if (paid.filtersfavoriteusers?.timecode < timecode)
		paid.filtersfavoriteusers.enabled = false;
	if (paid.longfiltersfavoriteusers?.timecode < timecode)
		paid.longfiltersfavoriteusers.enabled = false;
	if (paid.photofull?.timecode < timecode) paid.photofull.enabled = false;
	if (paid.photoload10?.timecode < timecode) paid.photoload10.enabled = false;
	if (paid.photoload15?.timecode < timecode) paid.photoload15.enabled = false;
	if (paid.photoload20?.timecode < timecode) paid.photoload20.enabled = false;
	if (paid.photoload25?.timecode < timecode) paid.photoload25.enabled = false;
	if (paid.photoload30?.timecode < timecode) paid.photoload30.enabled = false;
	if (paid.interests20?.timecode < timecode) paid.interests20.enabled = false;
	if (paid.interests30?.timecode < timecode) paid.interests30.enabled = false;
	if (paid.historymessages20?.timecode < timecode)
		paid.historymessages20.enabled = false;
	if (paid.historymessages40?.timecode < timecode)
		paid.historymessages40.enabled = false;
	if (paid.historymessages60?.timecode < timecode)
		paid.historymessages60.enabled = false;
	if (paid.historymessages80?.timecode < timecode)
		paid.historymessages80.enabled = false;
	if (paid.historymessages100?.timecode < timecode)
		paid.historymessages100.enabled = false;
	if (paid.historymessages200?.timecode < timecode)
		paid.historymessages200.enabled = false;
	if (paid.historymessages300?.timecode < timecode)
		paid.historymessages300.enabled = false;

	return paid;
}

export async function queryPaidNext(
	res: any,
	nameTariff: PAID_PROPERTY,
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
		const timetariff = tariff[posTariff].amountDay * TIMECODE_DAY;
		const timecode = getTimecodeNow();

		if (timecode < paid[nameTariff].timecode) {
			paid[nameTariff].timecode += timetariff;
		} else {
			paid[nameTariff].timecode = timecode + timetariff;
		}

		paid[nameTariff].enabled = true;
		cash -= tariff[posTariff].price;

		testPaidOnOverflow(paid);

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
