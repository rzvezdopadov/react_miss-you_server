import { queryGetSticker } from "../../user/shop/stickerpacks/stickerpacksAPI";
import { queryGetCaptcha } from "./captchaAPI";
import {
	queryCheckPhoto,
	queryDeletePhoto,
	queryGetPhoto,
	queryLoadPhoto,
} from "./imagesAPI";

const express = require("express");
const router = express.Router();

// All
router.get("/api/captcha/*", [], queryGetCaptcha);

router.get("/api/photo/*.jpg", [], queryGetPhoto);

router.get("/api/sticker/*.png", [], queryGetSticker);
router.get("/api/sticker/*.webp", [], queryGetSticker);

// User
router.post("/api/photo", [], queryLoadPhoto);
router.put("/api/photo", [], queryCheckPhoto);
router.delete("/api/photo", [], queryDeletePhoto);

module.exports = router;
