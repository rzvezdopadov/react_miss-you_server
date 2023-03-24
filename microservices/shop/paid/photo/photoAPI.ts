import { testToken } from "../../../auth/token";
import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../../utils/answerstatus";
import { getTariffsShopFromDB } from "../../shopDB";
import { queryPaidNext } from "../paidUtils";

export async function queryGetPhotoFullTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const photofull = await getTariffsShopFromDB("photofull");

		return res.status(200).json(photofull);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyPhotoFull(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "photofull", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetPhotoLoad10Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const photoload10 = await getTariffsShopFromDB("photoload10");

		return res.status(200).json(photoload10);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyPhotoLoad10(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "photoload10", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetPhotoLoad15Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const photoload15 = await getTariffsShopFromDB("photoload15");

		return res.status(200).json(photoload15);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyPhotoLoad15(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "photoload15", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetPhotoLoad20Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const photoload20 = await getTariffsShopFromDB("photoload20");

		return res.status(200).json(photoload20);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyPhotoLoad20(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "photoload20", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetPhotoLoad25Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const photoload25 = await getTariffsShopFromDB("photoload25");

		return res.status(200).json(photoload25);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyPhotoLoad25(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "photoload25", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetPhotoLoad30Tariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const photoload30 = await getTariffsShopFromDB("photoload30");

		return res.status(200).json(photoload30);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyPhotoLoad30(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { idtariff } = req.body;

		queryPaidNext(res, "photoload30", idtariff, jwtDecode.userId);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
