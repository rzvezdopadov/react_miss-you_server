import { queryLogin } from "./auth";
import { queryGetDialog, queryGetDialogs, querySetMessage } from "./dialogs";
import { querySetLike } from "./likes";
import { queryDeletePhoto, queryLoadPhoto } from "./photos";
import {
	queryGetProfile,
	queryGetProfiles,
	querySetProfile,
	querySetProfileShort,
} from "./profile";

const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

router.post(
	"/api/login",
	[
		check("email", "Некоректный email").isEmail(),
		check("password", "Некоректный пароль").isLength({ min: 8, max: 30 }),
	],
	queryLogin
);

router.put("/api/profile", [], querySetProfile);

router.put("/api/profileshort", [], querySetProfileShort);

router.get("/api/profile", [], queryGetProfile);

router.get("/api/profiles", [], queryGetProfiles);

router.put("/api/like", [], querySetLike);

router.put("/api/message", [], querySetMessage);

router.get("/api/dialog", [], queryGetDialog);

router.get("/api/dialogs", [], queryGetDialogs);

router.put("/api/photo", [], queryLoadPhoto);

router.delete("/api/photo", [], queryDeletePhoto);

module.exports = router;
