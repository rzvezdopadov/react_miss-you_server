import { IDialogOutput } from "../interfaces/iprofiles";
import { testToken } from "../utils/token";
import { getDialogsByIdFromDB } from "../query/dialogs";
import { getProfilesForDialogs } from "../query/profile";
import { getDialog, getDialogs, setDialog } from "../utils/dialogs";

export async function querySetMessage(req, res) {
	try {
		let { id, message } = req.body;
		const userId = Number(id);
		message = String(message);

		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		if (!userId)
			return res.status(400).json({
				message: "Чтобы отправить сообщение, выберите пользователя!",
			});

		const newDialog = await setDialog(jwtDecode.userId, userId, message);

		if (newDialog.messages.length) {
			return res.status(200).json(newDialog);
		} else {
			return res.status(400).json({
				message: "Ошибка отправки сообщения!",
			});
		}
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}

export async function queryGetDialog(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		let { id } = req.query;
		id = Number(id);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		if (!id) {
			return res
				.status(400)
				.json({ message: "Нужно выбрать пользователя!" });
		}

		const dialog = await getDialog(jwtDecode.userId, id);

		if (dialog.userId) {
			return res.status(200).json(dialog);
		} else {
			return res.status(400).json({
				message: "Ошибка отправки сообщения!",
			});
		}
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}

export async function queryGetDialogs(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const dialogs = await getDialogs(jwtDecode.userId);

		return res.status(200).json(dialogs);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}
