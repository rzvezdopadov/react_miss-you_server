import {
	queryBuyPhotoFull,
	queryBuyPhotoLoad10,
	queryBuyPhotoLoad15,
	queryBuyPhotoLoad20,
	queryBuyPhotoLoad25,
	queryBuyPhotoLoad30,
	queryGetPhotoFullTariffs,
	queryGetPhotoLoad10Tariffs,
	queryGetPhotoLoad15Tariffs,
	queryGetPhotoLoad20Tariffs,
	queryGetPhotoLoad25Tariffs,
	queryGetPhotoLoad30Tariffs,
} from "./photoAPI";

const express = require("express");
const router = express.Router();

// Users rout
router.get("/api/shop/photofulltariffs", [], queryGetPhotoFullTariffs);
router.post("/api/shop/buyphotofull", [], queryBuyPhotoFull);

router.get("/api/shop/photoload10tariffs", [], queryGetPhotoLoad10Tariffs);
router.post("/api/shop/buyphotoload10", [], queryBuyPhotoLoad10);

router.get("/api/shop/photoload15tariffs", [], queryGetPhotoLoad15Tariffs);
router.post("/api/shop/buyphotoload15", [], queryBuyPhotoLoad15);

router.get("/api/shop/photoload20tariffs", [], queryGetPhotoLoad20Tariffs);
router.post("/api/shop/buyphotoload20", [], queryBuyPhotoLoad20);

router.get("/api/shop/photoload25tariffs", [], queryGetPhotoLoad25Tariffs);
router.post("/api/shop/buyphotoload25", [], queryBuyPhotoLoad25);

router.get("/api/shop/photoload30tariffs", [], queryGetPhotoLoad30Tariffs);
router.post("/api/shop/buyphotoload30", [], queryBuyPhotoLoad30);

module.exports = router;
