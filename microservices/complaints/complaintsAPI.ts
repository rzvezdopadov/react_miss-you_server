import { getComplaints } from "./complaintsUtils";
import { testToken } from "../auth/token";
import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../utils/answerstatus";

export async function queryGetComplaints(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const complaints = await getComplaints(jwtDecode.userId);

		return res.status(200).json(complaints);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
