import { validationResult } from "express-validator";
import {
	IChangePass,
	ILogin,
	IProfile,
	IProfileRegistration,
	IRegistration,
} from "../interfaces/iprofiles";
import {
	createProfile,
	getIdByEmailFromDB,
	getPasswordByIdFromDB,
	setJWTToDB,
	setPasswordByIdToDB,
} from "../query/auth";
import {
	arr_age,
	arr_gender,
	arr_genderVapor,
	arr_growth,
	arr_location,
} from "../arrdata/profiles";
import { getSignZodiac } from "../utils/profile";
import { getTimecodeNow } from "../utils/datetime";
import { getRandomString } from "../utils/string";
import { isHaveCaptcha } from "./captcha";
import { testToken } from "../utils/token";

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

		const registration: IRegistration = req.body;

		const candidate = await getIdByEmailFromDB(registration.email);

		if (candidate !== "") {
			return res
				.status(400)
				.json({ message: "Такой пользователь уже существует!" });
		}
		if (
			registration.gender < 0 ||
			registration.gender > arr_gender.length
		) {
			return res
				.status(400)
				.json({ message: "Неверно задано поле 'Кто я?'!" });
		}
		if (
			registration.gendervapor < 0 ||
			registration.gendervapor > arr_genderVapor.length
		) {
			return res
				.status(400)
				.json({ message: "Неверно задано поле 'Кого ищу?'!" });
		}
		if (!arr_location.includes(registration.location)) {
			return res
				.status(400)
				.json({ message: "Неверно задано поле 'Локация'!" });
		}
		if (
			registration.growth < arr_growth[0] ||
			registration.growth > arr_growth[arr_growth.length - 1]
		) {
			return res
				.status(400)
				.json({ message: "Неверно задано поле 'Рост'!" });
		}
		if (!registration.name) {
			return res.status(400).json({ message: "Не указанно имя!" });
		}

		if (!isHaveCaptcha(registration.captcha)) {
			return res.status(400).json({
				message: "Код с картинки неверный или просрочен!",
			});
		}

		const hashedPassword = await bcrypt.hash(
			registration.password,
			config.get("saltpass")
		);

		const profile: IProfileRegistration = {
			email: registration.email,
			password: hashedPassword,
			jwt: "",
			userid: getRandomString(8),
			timecode: getTimecodeNow(),
			name: registration.name,
			latitude: 0,
			longitude: 0,
			location: registration.location,
			likes: [],
			birthday: registration.birthday,
			monthofbirth: registration.monthofbirth,
			yearofbirth: registration.yearofbirth,
			growth: registration.growth,
			weight: 0,
			gender: registration.gender,
			gendervapor: registration.gendervapor,
			photomain: 0,
			photolink: [],
			signzodiac: getSignZodiac(
				registration.birthday,
				registration.monthofbirth
			),
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
			cash: 100,
			filters: {
				location: registration.location,
				signzodiac: 12,
				agestart: arr_age[0],
				ageend: arr_age[arr_age.length - 1],
				growthstart: arr_growth[0],
				growthend: arr_growth[arr_growth.length - 1],
				weight: 0,
				gendervapor: registration.gendervapor,
				religion: 0,
				smoke: 0,
				alcohol: 0,
				interests: [],
			},
			acctype: "user",
			visit: [],
		};

		const isReg = await createProfile(profile);

		if (isReg)
			return res
				.status(201)
				.json({ message: "Пользователь успешно создан!" });

		res.status(400).json({ message: "Возникла ошибка при регистрации!" });
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
				message: "Некорректные данные при входе в систему!",
			});
		}

		let params: ILogin = req.body;
		params.email = String(params.email);
		params.password = String(params.password);
		params.captcha = String(params.captcha);

		if (!isHaveCaptcha(params.captcha)) {
			return res.status(400).json({
				message: "Код с картинки неверный или просрочен!",
			});
		}

		const ourId = await getIdByEmailFromDB(params.email);

		if (ourId === "") {
			return res
				.status(400)
				.json({ message: "Такой пользователь не существует!" });
		}

		const pass = await getPasswordByIdFromDB(ourId);

		const isMatch = await bcrypt.compare(params.password, pass);

		if (!isMatch) {
			return res.status(400).json({
				message: "Неверный пароль, попробуйте снова!",
			});
		}

		const token = await jwtToken.sign(
			{ userId: ourId },
			config.get("jwtSecret"),
			{ expiresIn: "7d" }
		);

		const answerSetJWT = await setJWTToDB(ourId, token);

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

export async function queryChangePass(req, res) {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				message: "Некорректные данные при изменении пароля!",
			});
		}

		let params: IChangePass = req.body;
		params.passwordnow = String(params.passwordnow);
		params.passwordnew = String(params.passwordnew);
		params.captcha = String(params.captcha);

		if (!isHaveCaptcha(params.captcha)) {
			return res.status(400).json({
				message: "Код с картинки неверный или просрочен!",
			});
		}

		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const pass = await getPasswordByIdFromDB(jwtDecode.userId);

		const isMatch = await bcrypt.compare(params.passwordnow, pass);

		if (!isMatch) {
			return res.status(400).json({
				message: "Неверный пароль, попробуйте снова!",
			});
		}

		const hashedPassword = await bcrypt.hash(
			params.passwordnew,
			config.get("saltpass")
		);

		const isSaveNewPassword = await setPasswordByIdToDB(
			jwtDecode.userId,
			hashedPassword
		);

		if (!isSaveNewPassword) {
			return res.status(400).json({
				message: "Ошибка при изменении пароля!",
			});
		}

		return res.status(200).json({
			message: "Пароль успешно изменен!",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Что-то пошло не так при изменении пароля!",
		});
	}
}
