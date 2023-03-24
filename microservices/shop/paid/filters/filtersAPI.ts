import { testToken } from "../../../auth/token";
import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../../utils/answerstatus";
import { getTariffsShopFromDB } from "../../shopDB";
import { queryPaidNext } from "../paidUtils";

export async function queryGetLongFiltersTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const longfilters = await getTariffsShopFromDB("longfilters");

		return res.status(200).json(longfilters);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyLongFilters(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "longfilters", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetFiltersVaporsTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const filtersvapors = await getTariffsShopFromDB("filtersvapors");

		return res.status(200).json(filtersvapors);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyFiltersVapors(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "filtersvapors", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetLongFiltersVaporsTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const longfiltersvapors = await getTariffsShopFromDB(
			"longfiltersvapors"
		);

		return res.status(200).json(longfiltersvapors);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyLongFiltersVapors(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "longfiltersvapors", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetFiltersFavoriteUsersTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const filtersfavoriteusers = await getTariffsShopFromDB(
			"filtersfavoriteusers"
		);

		return res.status(200).json(filtersfavoriteusers);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyFiltersFavoriteUsers(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "filtersfavoriteusers", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetLongFilterFavoriteUsersTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const longfilterfavoriteusers = await getTariffsShopFromDB(
			"longfilterfavoriteusers"
		);

		return res.status(200).json(longfilterfavoriteusers);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyLongFilterFavoriteUsers(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(
			res,
			"longfilterfavoriteusers",
			idtariff,
			jwtDecode.userId
		);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
