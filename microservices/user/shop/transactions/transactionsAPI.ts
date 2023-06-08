import {
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../../utils/answerstatus";
import { normalizeString } from "../../../../utils/normalize";
import { testToken } from "../../../all/auth/token";
import { getTransactionFromDB } from "./transactionsDB";

export async function queryGetTransactions(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const transactions = await getTransactionFromDB(jwtDecode.userId);

		return res.status(200).json(transactions);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
