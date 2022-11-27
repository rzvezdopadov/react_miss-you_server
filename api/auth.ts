import { validationResult } from "express-validator";
import { IProfile, IRegistration } from "../interfaces/iprofiles";
import {
	createProfile,
	getIdByEmailFromDB,
	getPasswordByIdFromDB,
	setJWTToDB,
} from "../query/auth";

const bcrypt = require("bcryptjs");
const config = require("config");
const jwtToken = require("jsonwebtoken");

export async function queryRegistration(req, res) {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: "Некорректные данные при регистрации!",
			});
		}

		const reg: IRegistration = req.body;

		const candidate = getIdByEmailFromDB(reg.email);

		if ((await candidate) !== -1) {
			return res
				.status(400)
				.json({ message: "Такой пользователь уже существует!" });
		}

		if (!reg.name) {
			return res.status(400).json({ message: "Не указанно имя!" });
		}

		const hashedPassword = await bcrypt.hash(reg.password, 13);

		const profile: IProfile = {
			id: 0,
			name: reg.name,
			latitude: 0,
			longitude: 0,
			location: "",
			likes: [],
			age: 0,
			birthday: 0,
			monthofbirth: 0,
			yearofbirth: 0,
			growth: 0,
			weight: 0,
			gender: reg.gender,
			gendervapor: reg.gendervapor,
			photomain: 0,
			photolink: [],
			signzodiac: 0,
			education: 0,
			fieldofactivity: 0,
			maritalstatus: 0,
			children: 0,
			religion: 0,
			smoke: 0,
			alcohol: 0,
			discription: "",
			profit: 0,
			interests: [],
			ilikecharacter: [],
			idontlikecharacter: [],
			raiting: 0,
			filters: undefined,
		};

		createProfile(profile);

		res.status(201).json({ message: "Пользователь успешно создан!" });
	} catch (e) {
		res.status(500).json({
			message: "Что-то пошло не так при регистрации!",
			messageOther: e.message,
		});
	}
}

export async function queryLogin(req, res) {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array(),
				message: "Некорректные данные при входе в систему!",
			});
		}

		let { email, password } = req.body;
		email = String(email);
		password = String(password);

		const userId = await getIdByEmailFromDB(email);

		if (userId === -1) {
			return res
				.status(400)
				.json({ message: "Такой пользователь не существует!" });
		}

		const pass = await getPasswordByIdFromDB(userId);

		const isMatch = await bcrypt.compare(password, pass);

		if (!isMatch) {
			return res.status(400).json({
				message: "Неверный пароль, попробуйте снова!",
			});
		}

		const token = await jwtToken.sign(
			{ userId: userId },
			config.get("jwtSecret"),
			{ expiresIn: "7d" }
		);

		const answerSetJWT = await setJWTToDB(userId, token);

		if (answerSetJWT) {
			return res.status(200).json({
				jwt: token,
				message: "Вы успешно авторизовались!",
			});
		} else {
			return res.status(400).json({
				message: "Ошибка QTDB!",
			});
		}
	} catch (e) {
		res.status(500).json({
			message: "Что-то пошло не так при аутентификации!",
		});
	}
}
