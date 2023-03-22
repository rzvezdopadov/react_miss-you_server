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
import { answerFailJWT, answerFailQTDB } from "../../utils/answerfail";

export async function queryGetRatingTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerFailJWT(res);

		const ratingtariffs = await getRatingTariffs();

		return res.status(200).json(ratingtariffs);
	} catch (error) {
		return answerFailQTDB(res, error);
	}
}

export async function queryBuyRating(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerFailJWT(res);

		const { idrate } = req.body;
		const ratingtariffs = await getRatingTariffs();
		const posTariff = ratingtariffs.findIndex(
			(value) => value.idRate === idrate
		);

		if (posTariff === -1)
			return res.status(400).json({
				message: "Такого тарифа не существует!",
			});

		let cash = await getProfileCashByIdFromDB(jwtDecode.userId);

		if (cash - ratingtariffs[posTariff].price < 0)
			return res.status(400).json({
				message:
					"Недостаточно MY-баллов для покупки, пополните балланс!",
			});

		let rating = await getProfileRatingByIdFromDB(jwtDecode.userId);

		rating += ratingtariffs[posTariff].amountRate;
		cash -= ratingtariffs[posTariff].price;

		await setProfileRatingByIdToDB(jwtDecode.userId, rating);
		await setProfileCashByIdToDB(jwtDecode.userId, cash);

		const profile = await getProfileByIdFromDB(jwtDecode.userId);

		return res.status(200).json(profile);
	} catch (error) {
		return answerFailQTDB(res, error);
	}
}

export async function queryAddStickerpack(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerFailJWT(res);

		let { idstickerpack }: { idstickerpack: string } = req.body;
		idstickerpack = String(idstickerpack);

		const profileStickerpacks = await getProfileStickerpacksByIdFromDB(
			jwtDecode.userId
		);

		if (profileStickerpacks.includes(idstickerpack))
			return res.status(400).json({
				message: "У вас уже есть данный стикерпак!",
			});

		const stickerpacks = await getAllStickerpacks();
		const stickerpackIndex = stickerpacks.findIndex(
			(value) => value.idstickerpack === idstickerpack
		);

		if (stickerpackIndex === -1)
			return res.status(400).json({
				message: "Данного стикерпака не существует!",
			});

		const priceStickerpack = stickerpacks[stickerpackIndex].price;

		if (priceStickerpack === 0) {
			profileStickerpacks.unshift(idstickerpack);

			const answerAddStickerpack = await setProfileStickerpacksByIdToDB(
				jwtDecode.userId,
				profileStickerpacks
			);

			if (!answerAddStickerpack)
				return res.status(400).json({
					message: "Произошла ошибка добавления стикерпака!",
				});
		} else {
			let cash = await getProfileCashByIdFromDB(jwtDecode.userId);

			if (cash - priceStickerpack < 0)
				return res.status(400).json({
					message:
						"Недостаточно MY-баллов для покупки, пополните балланс!",
				});

			profileStickerpacks.unshift(idstickerpack);

			cash -= priceStickerpack;
			const answerAddStickerpack = await setProfileStickerpacksByIdToDB(
				jwtDecode.userId,
				profileStickerpacks
			);

			if (!answerAddStickerpack)
				return res.status(400).json({
					message: "Произошла ошибка добавления стикерпака!",
				});

			await setProfileCashByIdToDB(jwtDecode.userId, cash);
		}

		const profile = await getProfileByIdFromDB(jwtDecode.userId);

		return res.status(200).json(profile);
	} catch (error) {
		return answerFailQTDB(res, error);
	}
}

export async function queryDeleteStickerpack(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerFailJWT(res);

		let { idstickerpack }: { idstickerpack: string } = req.body;
		idstickerpack = String(idstickerpack);

		const profileStickerpacks = await getProfileStickerpacksByIdFromDB(
			jwtDecode.userId
		);

		const profileStickerpackIndex = profileStickerpacks.findIndex(
			(value) => value === idstickerpack
		);

		if (profileStickerpackIndex === -1)
			return res.status(400).json({
				message: "У вас нет такого стикерпака!",
			});

		profileStickerpacks.splice(profileStickerpackIndex, 1);

		await setProfileStickerpacksByIdToDB(
			jwtDecode.userId,
			profileStickerpacks
		);

		const profile = await getProfileByIdFromDB(jwtDecode.userId);

		return res.status(200).json(profile);
	} catch (error) {
		return answerFailQTDB(res, error);
	}
}
