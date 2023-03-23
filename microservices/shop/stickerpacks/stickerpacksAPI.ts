import {
	answerStatus400,
	answerStatusJWT,
	answerStatusQTDB,
} from "../../../utils/answerstatus";
import { testToken } from "../../auth/token";
import {
	getProfileStickerpacksByIdFromDB,
	setProfileStickerpacksByIdToDB,
	getProfileCashByIdFromDB,
	setProfileCashByIdToDB,
	getProfileByIdFromDB,
} from "../../profile/profileDB";
import { getAllStickerpacks } from "./stickerpacksDB";
import { getWaySticker } from "./stickerpacksUtils";

export async function queryGetAllStickerpacks(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const stickerpacks = await getAllStickerpacks();

		return res.status(200).json(stickerpacks);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetSticker(req, res, next) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const { url } = req;
		let nameFile: string = url.replace("/api/sticker/", "");

		res.setHeader("Cache-Control", "public, max-age=31557600");

		return res.sendFile(getWaySticker(nameFile), {}, (error) => {
			if (error) next();
		});
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
