import path from "path";
const express = require("express");
const router = express.Router();

function answerIndex(res: any, next: any) {
	res.status(200).sendFile(
		path.join(__dirname, "./index.html"),
		{},
		(error) => {
			if (error) next();
		}
	);
}

// User
const linkAuthUser = [
	"/registration",
	"/login",
	"/recoverypass",
	"/about",
	"/partners",
	"/agreement",
	"/vapors",
	"/favoriteusers",
	"/dialogs",
	"/users",
	"/settings",
	"/shop",
	"/logout",
];

// Admin
const linkAuthAdmin = [
	"/registration",
	"/login",
	"/recoverypass",
	"/about",
	"/partners",
	"/agreement",
	"/statistics",
	"/dialogs",
	"/users",
	"/settings",
	"/logout",
];

linkAuthUser.forEach((way) =>
	router.get(way, (_req, res, next) => answerIndex(res, next))
);
linkAuthAdmin.forEach((way) =>
	router.get(way, (_req, res, next) => answerIndex(res, next))
);

router.get("/", function (_req, res, next) {
	answerIndex(res, next);
});

router.get("/*", function (_req, res) {
	res.status(404).json({ message: "pnf" });
});

module.exports = router;
