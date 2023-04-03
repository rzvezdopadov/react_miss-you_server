import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../utils/answerstatus";
import { testToken } from "../../all/auth/token";
import { setFavoriteUsersById } from "./favoriteusersUtils";

export async function queryFavoriteUsers(req, res) {
	try {
		let { userid } = req.body;
		userid = String(userid);

		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const favoriteUsers = await setFavoriteUsersById(
			jwtDecode.userId,
			userid
		);

		return res.status(200).json(favoriteUsers);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
