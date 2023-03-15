import path from "path";
const express = require("express");
const router = express.Router();

function answerIndex(res: any) {
	res.status(200).sendFile(path.join(__dirname, "./index.html"));
}

// User
const linkAuthUser = ["/vapors", "/dialogs", "/searchvapors", "/shop"];

// Admin
const linkAuthAdmin = [
	"/statistics",
	"/dialogs",
	"/userprofiles",
	"/shop",
	"/logout",
];

// All
const linkNoAuth = ["/about", "/partners", "/enter", "/settings", "/logout"];

linkAuthUser.forEach((way) => router.get(way, (_req, res) => answerIndex(res)));
linkAuthAdmin.forEach((way) =>
	router.get(way, (_req, res) => answerIndex(res))
);
linkNoAuth.forEach((way) => router.get(way, (_req, res) => answerIndex(res)));

router.get("/*", function (_req, res) {
	res.status(404).json({ message: "pnf" });
});

module.exports = router;
