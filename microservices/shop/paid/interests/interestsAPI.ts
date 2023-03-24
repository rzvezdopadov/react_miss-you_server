import { testToken } from "../../../auth/token";
import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../../utils/answerstatus";
import { getTariffsShopFromDB } from "../../shopDB";
import { queryPaidNext } from "../paidUtils";

export async function queryGetInterests20Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const interests20 = await getTariffsShopFromDB("interests20");

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

		queryPaidNext(res, "interests20", idtariff, jwtDecode.userId);
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

		const interests30 = await getTariffsShopFromDB("interests30");

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

		queryPaidNext(res, "interests30", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
