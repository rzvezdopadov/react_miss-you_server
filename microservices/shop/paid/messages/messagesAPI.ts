import { testToken } from "../../../auth/token";
import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../../utils/answerstatus";
import { getTariffsShopFromDB } from "../../shopDB";
import { queryPaidNext } from "../paidUtils";

export async function queryGetMessagesWriteTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const messageswrite = await getTariffsShopFromDB("messageswrite");

		return res.status(200).json(messageswrite);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyMessagesWrite(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "messageswrite", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetMessagesReadTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const messagesread = await getTariffsShopFromDB("messagesread");

		return res.status(200).json(messagesread);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyMessagesRead(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "messagesread", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
