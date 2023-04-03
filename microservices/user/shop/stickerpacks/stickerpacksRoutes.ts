import {
	queryAddStickerpack,
	queryDeleteStickerpack,
	queryGetAllStickerpacks,
} from "./stickerpacksAPI";

const express = require("express");
const router = express.Router();

// Users routs
router.get("/api/shop/stickerpacks", [], queryGetAllStickerpacks);
router.post("/api/shop/stickerpack", [], queryAddStickerpack);
router.delete("/api/shop/stickerpack", [], queryDeleteStickerpack);

module.exports = router;
