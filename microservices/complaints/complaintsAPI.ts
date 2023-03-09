import { getComplaints } from "./complaintsUtils";
import { testToken } from "../auth/token";

export async function queryGetComplaints(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const complaints = await getComplaints(jwtDecode.userId);

		return res.status(200).json(complaints);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}
