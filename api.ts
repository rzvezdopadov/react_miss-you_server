import path from "path";
const express = require("express");
const router = express.Router();

router.get("/*", function (_req, res) {
	res.sendFile(path.join(__dirname, "../index.html"));
});

module.exports = router;
