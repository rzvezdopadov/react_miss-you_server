import { getTariffsShopFromDB } from "../../shopDB";
import { queryPaidNext } from "../paidUtils";
import { PAID_PROPERTY } from "../ipaid";
import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../../../utils/answerstatus";
import { testToken } from "../../../../all/auth/token";

export async function queryGetInterests20Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const interests20 = await getTariffsShopFromDB(
			PAID_PROPERTY.interests20
		);

		return res.status(200).json(interests20);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyInterests20(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.interests20,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetInterests30Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const interests30 = await getTariffsShopFromDB(
			PAID_PROPERTY.interests30
		);

		return res.status(200).json(interests30);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyInterests30(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.interests30,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
