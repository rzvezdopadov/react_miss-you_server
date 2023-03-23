import {
	getProfileByIdFromDB,
	getProfileCashByIdFromDB,
	getProfileRatingByIdFromDB,
	getProfileStickerpacksByIdFromDB,
	setProfileCashByIdToDB,
	setProfileRatingByIdToDB,
	setProfileStickerpacksByIdToDB,
} from "../profile/profile/profileDB";
import { getRatingTariffs } from "./shopDB";
import { testToken } from "../auth/token";
import { getAllStickerpacks } from "./stickerpacks/stickerpacksDB";
import {
	answerStatus400,
	answerStatusJWT,
	answerStatusQTDB,
} from "../../utils/answerstatus";

export async function queryGetRatingTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const ratingtariffs = await getRatingTariffs();

		return res.status(200).json(ratingtariffs);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryBuyRating(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const { idrate } = req.body;
		const ratingtariffs = await getRatingTariffs();
		const posTariff = ratingtariffs.findIndex(
			(value) => value.idRate === idrate
		);

		if (posTariff === -1)
			return answerStatus400(res, "Такого тарифа не существует!");

		let cash = await getProfileCashByIdFromDB(jwtDecode.userId);

		if (cash - ratingtariffs[posTariff].price < 0)
			return answerStatus400(
				res,
				"Недостаточно MY-баллов для покупки, пополните балланс!"
			);

		let rating = await getProfileRatingByIdFromDB(jwtDecode.userId);

		rating += ratingtariffs[posTariff].amountRate;
		cash -= ratingtariffs[posTariff].price;

		await setProfileRatingByIdToDB(jwtDecode.userId, rating);
		await setProfileCashByIdToDB(jwtDecode.userId, cash);

		const profile = await getProfileByIdFromDB(jwtDecode.userId);

		return res.status(200).json(profile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryAddStickerpack(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		let { idstickerpack }: { idstickerpack: string } = req.body;
		idstickerpack = String(idstickerpack);

		const profileStickerpacks = await getProfileStickerpacksByIdFromDB(
			jwtDecode.userId
		);

		if (profileStickerpacks.includes(idstickerpack))
			return answerStatus400(res, "У вас уже есть данный стикерпак!");

		const stickerpacks = await getAllStickerpacks();
		const stickerpackIndex = stickerpacks.findIndex(
			(value) => value.idstickerpack === idstickerpack
		);

		if (stickerpackIndex === -1)
			return answerStatus400(res, "Данного стикерпака не существует!");

		const priceStickerpack = stickerpacks[stickerpackIndex].price;

		if (priceStickerpack === 0) {
			profileStickerpacks.unshift(idstickerpack);

			const answerAddStickerpack = await setProfileStickerpacksByIdToDB(
				jwtDecode.userId,
				profileStickerpacks
			);

			if (!answerAddStickerpack)
				return answerStatus400(
					res,
					"Произошла ошибка добавления стикерпака!"
				);
		} else {
			let cash = await getProfileCashByIdFromDB(jwtDecode.userId);

			if (cash - priceStickerpack < 0)
				return answerStatus400(
					res,
					"Недостаточно MY-баллов для покупки, пополните балланс!"
				);

			profileStickerpacks.unshift(idstickerpack);

			cash -= priceStickerpack;
			const answerAddStickerpack = await setProfileStickerpacksByIdToDB(
				jwtDecode.userId,
				profileStickerpacks
			);

			if (!answerAddStickerpack)
				return answerStatus400(
					res,
					"Произошла ошибка добавления стикерпака!"
				);

			await setProfileCashByIdToDB(jwtDecode.userId, cash);
		}

		const profile = await getProfileByIdFromDB(jwtDecode.userId);

		return res.status(200).json(profile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryDeleteStickerpack(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		let { idstickerpack }: { idstickerpack: string } = req.body;
		idstickerpack = String(idstickerpack);

		const profileStickerpacks = await getProfileStickerpacksByIdFromDB(
			jwtDecode.userId
		);

		const profileStickerpackIndex = profileStickerpacks.findIndex(
			(value) => value === idstickerpack
		);

		if (profileStickerpackIndex === -1)
			return answerStatus400(res, "У вас нет такого стикерпака!");

		profileStickerpacks.splice(profileStickerpackIndex, 1);

		await setProfileStickerpacksByIdToDB(
			jwtDecode.userId,
			profileStickerpacks
		);

		const profile = await getProfileByIdFromDB(jwtDecode.userId);

		return res.status(200).json(profile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
