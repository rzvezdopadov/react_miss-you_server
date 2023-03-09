import { queryGetCaptcha } from "./captchaAPI";
import { queryGetPhoto } from "./imagesAPI";
import { queryGetSticker } from "../shop/stickerpacks/stickerpacksAPI";

const express = require("express");
const router = express.Router();

router.get("/api/captcha/*", [], queryGetCaptcha);

router.get("/api/photo/*.jpg", [], queryGetPhoto);

router.get("/api/sticker/*.png", [], queryGetSticker);
router.get("/api/sticker/*.webp", [], queryGetSticker);

module.exports = router;
