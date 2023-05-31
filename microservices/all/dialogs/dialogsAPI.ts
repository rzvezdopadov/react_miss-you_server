import { getDialog, getDialogs } from "./dialogsUtils";
import { testToken } from "../auth/token";
import { IGetMessages } from "./idialogs";
import {
	answerStatus400,
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../utils/answerstatus";
import { normalizeNumber, normalizeString } from "../../../utils/normalize";

export async function queryGetDialog(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);
		if (!jwtDecode) return answerStatusFailJWT(res);

		let QueryGetMessages: IGetMessages = req.query;
		QueryGetMessages.ourid = jwtDecode.userId;
		QueryGetMessages.userid = normalizeString(QueryGetMessages.userid);
		QueryGetMessages.startcount = normalizeNumber(
			QueryGetMessages.startcount
		);
		QueryGetMessages.amount = normalizeNumber(QueryGetMessages.amount);

		if (!QueryGetMessages.userid)
			return answerStatus400(res, "Нужно выбрать пользователя!");

		const dialog = await getDialog(QueryGetMessages);

		if (dialog && dialog.userid) {
			return res.status(200).json(dialog);
		} else {
			return answerStatus400(res, "Ошибка отправки сообщения!");
		}
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetDialogs(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const dialogs = await getDialogs(jwtDecode.userId);

		return res.status(200).json(dialogs);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
