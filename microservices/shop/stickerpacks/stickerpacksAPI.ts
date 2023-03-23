import { answerStatusJWT, answerStatusQTDB } from "../../../utils/answerstatus";
import { testToken } from "../../auth/token";
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
