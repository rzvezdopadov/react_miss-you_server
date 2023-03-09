import {
	getProfileByIdFromDB,
	getProfileCashByIdFromDB,
	getProfileRatingByIdFromDB,
	getProfileStickerpacksByIdFromDB,
	setProfileCashByIdToDB,
	setProfileRatingByIdToDB,
	setProfileStickerpacksByIdToDB,
} from "../db/queryDB/profile";
import { getRatingTariffs } from "../db/queryDB/shop";
import { getAllStickerpacks } from "../db/queryDB/stikers";
import { testToken } from "../utils/token";

export async function queryGetRatingTariffs(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const ratingtariffs = await getRatingTariffs();

		return res.status(200).json(ratingtariffs);
	} catch (e) {
		res.status(500).json({
			message: "Токен не валидный!",
		});
	}
}

export async function queryBuyRating(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

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
	} catch (e) {
		res.status(500).json({
			message: "Токен не валидный!",
		});
	}
}

export async function queryAddStickerpack(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

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
	} catch (e) {
		res.status(500).json({
			message: "Токен не валидный!",
		});
	}
}

export async function queryDeleteStickerpack(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

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
	} catch (e) {
		res.status(500).json({
			message: "Токен не валидный!",
		});
	}
}
