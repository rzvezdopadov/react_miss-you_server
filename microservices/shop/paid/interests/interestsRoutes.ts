import {
	queryBuyInterests20,
	queryBuyInterests30,
	queryGetInterests20Tariffs,
	queryGetInterests30Tariffs,
} from "./interestsAPI";

const express = require("express");
const router = express.Router();

// Users rout
router.get("/api/shop/interests20tariffs", [], queryGetInterests20Tariffs);
router.post("/api/shop/buyinterests20", [], queryBuyInterests20);

router.get("/api/shop/interests30tariffs", [], queryGetInterests30Tariffs);
router.post("/api/shop/buyinterests30", [], queryBuyInterests30);

module.exports = router;
