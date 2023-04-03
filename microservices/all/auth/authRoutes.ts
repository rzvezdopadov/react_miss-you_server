import {
	queryChangePass,
	queryLogin,
	queryRecoveryPass,
	queryRegistration,
} from "./authAPI";

const express = require("express");
const router = express.Router();

const { check } = require("express-validator");

router.post(
	"/api/registration",
	[
		check("email", "Некоректный email").isEmail(),
		check("password", "Некоректный пароль").isLength({ min: 8, max: 30 }),
	],
	queryRegistration
);

router.post(
	"/api/login",
	[
		check("email", "Некоректный email").isEmail(),
		check("password", "Некоректный пароль").isLength({ min: 8, max: 30 }),
	],
	queryLogin
);

router.put(
	"/api/changepass",
	[
		check("passwordnow", "Некоректный текущий пароль").isLength({
			min: 8,
			max: 30,
		}),
		check("passwordnew", "Некоректный новый пароль").isLength({
			min: 8,
			max: 30,
		}),
	],
	queryChangePass
);

router.post("/api/recoverypass", [], queryRecoveryPass);

module.exports = router;
