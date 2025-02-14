import { getTariffsShopFromDB } from "../../shopDB";
import { queryPaidNext } from "../paidUtils";
import { PAID_PROPERTY } from "../ipaid";
import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../../../utils/answerstatus";
import { testToken } from "../../../../all/auth/token";
import { normalizeString } from "../../../../../utils/normalize";

export async function queryGetHistoryMessages20Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const historymessages20 = await getTariffsShopFromDB(
			PAID_PROPERTY.historymessages20
		);

		return res.status(200).json(historymessages20);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyHistoryMessages20(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.historymessages20,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetHistoryMessages40Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const historymessages40 = await getTariffsShopFromDB(
			PAID_PROPERTY.historymessages40
		);

		return res.status(200).json(historymessages40);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyHistoryMessages40(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.historymessages40,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetHistoryMessages60Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const historymessages60 = await getTariffsShopFromDB(
			PAID_PROPERTY.historymessages60
		);

		return res.status(200).json(historymessages60);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyHistoryMessages60(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.historymessages60,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetHistoryMessages80Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const historymessages80 = await getTariffsShopFromDB(
			PAID_PROPERTY.historymessages80
		);

		return res.status(200).json(historymessages80);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyHistoryMessages80(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.historymessages80,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetHistoryMessages100Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const historymessages100 = await getTariffsShopFromDB(
			PAID_PROPERTY.historymessages100
		);

		return res.status(200).json(historymessages100);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyHistoryMessages100(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.historymessages100,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetHistoryMessages200Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const historymessages200 = await getTariffsShopFromDB(
			PAID_PROPERTY.historymessages200
		);

		return res.status(200).json(historymessages200);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyHistoryMessages200(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.historymessages200,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetHistoryMessages300Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const historymessages300 = await getTariffsShopFromDB(
			PAID_PROPERTY.historymessages300
		);

		return res.status(200).json(historymessages300);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyHistoryMessages300(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.historymessages300,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
