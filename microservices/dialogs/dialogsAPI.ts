import { getDialog, getDialogs, setDialog } from "./dialogsUtils";
import { testToken } from "../auth/token";
import { MESSAGETYPE } from "./idialogs";
import { answerFailJWT, answerFailQTDB } from "../../utils/answerfail";

export async function querySetMessage(req, res) {
	try {
		let { userid, message } = req.body;
		const userId = String(userid);
		message = String(message);

		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerFailJWT(res);

		if (!userId)
			return res.status(400).json({
				message: "Чтобы отправить сообщение, выберите пользователя!",
			});

		const newDialog = await setDialog(
			jwtDecode.userId,
			userId,
			MESSAGETYPE.message,
			message,
			"",
			0
		);

		if (newDialog.messages.length) {
			return res.status(200).json(newDialog);
		} else {
			return res.status(400).json({
				message: "Ошибка отправки сообщения!",
			});
		}
	} catch (error) {
		return answerFailQTDB(res, error);
	}
}

export async function queryGetDialog(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		let { userid } = req.query;
		const userId = String(userid);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerFailJWT(res);

		if (!userId) {
			return res
				.status(400)
				.json({ message: "Нужно выбрать пользователя!" });
		}

		const dialog = await getDialog(jwtDecode.userId, userId);

		if (dialog.userid) {
			return res.status(200).json(dialog);
		} else {
			return res.status(400).json({
				message: "Ошибка отправки сообщения!",
			});
		}
	} catch (error) {
		return answerFailQTDB(res, error);
	}
}

export async function queryGetDialogs(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerFailJWT(res);

		const dialogs = await getDialogs(jwtDecode.userId);

		return res.status(200).json(dialogs);
	} catch (error) {
		return answerFailQTDB(res, error);
	}
}
