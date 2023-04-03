import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../utils/answerstatus";
import { testToken } from "../../all/auth/token";
import { setLikesById } from "./likesUtils";

export async function querySetLike(req, res) {
	try {
		let { userid } = req.body;
		userid = String(userid);

		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const likes = await setLikesById(jwtDecode.userId, userid);

		return res.status(200).json(likes);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
