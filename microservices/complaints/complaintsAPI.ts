import { getComplaints } from "./complaintsUtils";
import { testToken } from "../auth/token";
import { answerFailJWT, answerFailQTDB } from "../../utils/answerfail";

export async function queryGetComplaints(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerFailJWT(res);

		const complaints = await getComplaints(jwtDecode.userId);

		return res.status(200).json(complaints);
	} catch (error) {
		return answerFailQTDB(res, error);
	}
}
