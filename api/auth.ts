import { validationResult } from "express-validator";
import {
	IChangePass,
	ILogin,
	IProfileRegistration,
	IRecoveryPass,
	IRegistration,
} from "../interfaces/iauth";
import {
	createProfileToDB,
	getIdByEmailFromDB,
	getJWTFromDB,
	getPasswordByIdFromDB,
	setJWTToDB,
	setPasswordByIdToDB,
} from "../query/auth";
import { getSignZodiac } from "../utils/profile";
import { getTimecodeNow } from "../utils/datetime";
import { getRandomString } from "../utils/random";
import { isHaveCaptcha } from "./captcha";
import { testToken } from "../utils/token";
import { sendMessageToEmail } from "../utils/transporter";
import { getAdminBannedByIdFromDB } from "../query/admin";
import { ACCTYPE } from "../interfaces/iadmin";
import {
	data_age,
	data_gender,
	data_genderVapor,
	data_growth,
	data_location,
} from "../data/profiles";
import { isBannedUser } from "../utils/banned";

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
			registration.gender > data_gender.length
		) {
			return res
				.status(400)
				.json({ message: "Неверно задано поле 'Кто я?'!" });
		}
		if (
			registration.gendervapor < 0 ||
			registration.gendervapor > data_genderVapor.length
		) {
			return res
				.status(400)
				.json({ message: "Неверно задано поле 'Кого ищу?'!" });
		}
		if (!data_location.includes(registration.location)) {
			return res
				.status(400)
				.json({ message: "Неверно задано поле 'Локация'!" });
		}
		if (
			registration.growth < data_growth[0] ||
			registration.growth > data_growth[data_growth.length - 1]
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

		const timecode = getTimecodeNow();

		const profile: IProfileRegistration = {
			email: registration.email,
			password: hashedPassword,
			jwt: [],
			userid: getRandomString(12),
			coordinates: [],
			registrationdate: timecode,
			timecode: timecode,
			name: registration.name,
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
			rating: 0,
			cash: 1000,
			filters: {
				location: registration.location,
				agestart: data_age[0],
				ageend: data_age[data_age.length - 1],
				growthstart: data_growth[0],
				growthend: data_growth[data_growth.length - 1],
				weight: 0,
				signzodiac: 0,
				gendervapor: registration.gendervapor,
				education: 0,
				fieldofactivity: 0,
				maritalstatus: 0,
				children: 0,
				religion: 0,
				smoke: 0,
				alcohol: 0,
				profit: 0,
				interests: [],
			},
			acctype: ACCTYPE.user,
			visit: [],
			banned: { timecode: 0, whobanned: "", discription: "" },
			paid: {
				messageread: { enabled: false, timecode: 0 },
				longfilters: { enabled: false, timecode: 0 },
				userfavorite: { enabled: false, timecode: 0 },
				photoall: { enabled: false, timecode: 0 },
				photofull: { enabled: false, timecode: 0 },
				infinityinterests: { enabled: false, timecode: 0 },
				infinitymessages: { enabled: false, timecode: 0 },
				longfilterslikes: { enabled: false, timecode: 0 },
			},
			stickerpacks: [],
		};

		const isReg = await createProfileToDB(profile);

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

		const isBanned = await isBannedUser(ourId);

		if (isBanned)
			return res.status(400).json({
				message: isBanned,
			});

		const token = await jwtToken.sign(
			{ userId: ourId },
			config.get("jwtSecret"),
			{ expiresIn: "7d" }
		);

		const jwts = await getJWTFromDB(ourId);

		if (!jwts)
			return res.status(400).json({
				message: "Ошибка QTDB!",
			});

		const timeNow = getTimecodeNow();

		const timeAdd = 7 * 24 * 60 * 60 * 1000;

		const newJWTs = jwts.filter((jwt) => {
			if (jwt.timecode + timeAdd > timeNow) return true;
		});

		newJWTs.push({
			timecode: timeNow,
			token: token,
			ipaddress: "",
			browser: "",
		});

		const answerSetJWT = await setJWTToDB(ourId, newJWTs);

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

export async function queryRecoveryPass(req, res) {
	try {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({
				message: "Некорректные данные при изменении пароля!",
			});
		}

		let params: IRecoveryPass = req.body;
		params.email = String(params.email);
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

		await sendMessageToEmail(getRandomString(20), params.email);

		return res.status(200).json({
			message: "Инструкции по восстановлению высланы на e-mail!",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "Что-то пошло не так при изменении пароля!",
		});
	}
}
