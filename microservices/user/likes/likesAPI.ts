import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../utils/answerstatus";
import { normalizeString } from "../../../utils/normalize";
import { testToken } from "../../all/auth/token";
import { setLikesById } from "./likesUtils";

export async function querySetLike(req, res) {
	try {
		let { userid } = req.body;
		userid = normalizeString(userid);

		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const likes = await setLikesById(jwtDecode.userId, userid);

		return res.status(200).json(likes);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
