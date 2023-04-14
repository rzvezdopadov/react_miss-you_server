import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../utils/answerstatus";
import { normalizeString } from "../../../utils/normalize";
import { testToken } from "../../all/auth/token";
import { setBannedUsersById } from "./bannedusersUtils";

export async function queryBannedUsers(req, res) {
	try {
		let { userid } = req.body;
		userid = normalizeString(userid);

		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const bannedUsers = await setBannedUsersById(jwtDecode.userId, userid);

		if (bannedUsers) return res.status(200).json(bannedUsers);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
