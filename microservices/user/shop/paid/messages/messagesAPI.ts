import { getTariffsShopFromDB } from "../../shopDB";
import { queryPaidNext } from "../paidUtils";
import { PAID_PROPERTY } from "../ipaid";
import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../../../utils/answerstatus";
import { testToken } from "../../../../all/auth/token";
import { normalizeString } from "../../../../../utils/normalize";

export async function queryGetMessagesWriteTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const messageswrite = await getTariffsShopFromDB(
			PAID_PROPERTY.messageswrite
		);

		return res.status(200).json(messageswrite);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyMessagesWrite(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.messageswrite,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetMessagesReadTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const messagesread = await getTariffsShopFromDB(
			PAID_PROPERTY.messagesread
		);

		return res.status(200).json(messagesread);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyMessagesRead(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.messagesread,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
