import { getTariffsShopFromDB } from "../../shopDB";
import { queryPaidNext } from "../paidUtils";
import { PAID_PROPERTY } from "../ipaid";
import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../../../utils/answerstatus";
import { testToken } from "../../../../all/auth/token";
import { normalizeString } from "../../../../../utils/normalize";

export async function queryGetLongFiltersTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const longfilters = await getTariffsShopFromDB(
			PAID_PROPERTY.longfilters
		);

		return res.status(200).json(longfilters);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyLongFilters(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.longfilters,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetFiltersVaporsTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const filtersvapors = await getTariffsShopFromDB(
			PAID_PROPERTY.filtersvapors
		);

		return res.status(200).json(filtersvapors);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyFiltersVapors(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.filtersvapors,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetLongFiltersVaporsTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const longfiltersvapors = await getTariffsShopFromDB(
			PAID_PROPERTY.longfiltersvapors
		);

		return res.status(200).json(longfiltersvapors);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyLongFiltersVapors(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.longfiltersvapors,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetFiltersFavoriteUsersTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const filtersfavoriteusers = await getTariffsShopFromDB(
			PAID_PROPERTY.filtersfavoriteusers
		);

		return res.status(200).json(filtersfavoriteusers);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyFiltersFavoriteUsers(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.filtersfavoriteusers,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetLongFiltersFavoriteUsersTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const longfilterfavoriteusers = await getTariffsShopFromDB(
			PAID_PROPERTY.longfiltersfavoriteusers
		);

		return res.status(200).json(longfilterfavoriteusers);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyLongFiltersFavoriteUsers(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			PAID_PROPERTY.longfiltersfavoriteusers,
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
