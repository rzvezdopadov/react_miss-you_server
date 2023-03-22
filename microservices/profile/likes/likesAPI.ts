import { answerFailJWT, answerFailQTDB } from "../../../utils/answerfail";
import { testToken } from "../../auth/token";
import { setLikesById } from "./likesUtils";

export async function querySetLike(req, res) {
	try {
		let { userid } = req.body;
		userid = String(userid);

		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerFailJWT(res);

		const likes = await setLikesById(jwtDecode.userId, userid);

		return res.status(200).json(likes);
	} catch (error) {
		return answerFailQTDB(res, error);
	}
}
