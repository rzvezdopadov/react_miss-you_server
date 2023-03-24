import {
	queryBuyHistoryMessages100,
	queryBuyHistoryMessages150,
	queryBuyHistoryMessages20,
	queryBuyHistoryMessages200,
	queryBuyHistoryMessages300,
	queryBuyHistoryMessages40,
	queryBuyHistoryMessages60,
	queryBuyHistoryMessages80,
	queryGetHistoryMessages100Tariffs,
	queryGetHistoryMessages150Tariffs,
	queryGetHistoryMessages200Tariffs,
	queryGetHistoryMessages20Tariffs,
	queryGetHistoryMessages300Tariffs,
	queryGetHistoryMessages40Tariffs,
	queryGetHistoryMessages60Tariffs,
	queryGetHistoryMessages80Tariffs,
} from "./historymessagesAPI";

const express = require("express");
const router = express.Router();

// Users route
router.get(
	"/api/shop/historymessages20tariffs",
	[],
	queryGetHistoryMessages20Tariffs
);
router.post("/api/shop/buyhistorymessages20", [], queryBuyHistoryMessages20);

router.get(
	"/api/shop/historymessages40tariffs",
	[],
	queryGetHistoryMessages40Tariffs
);
router.post("/api/shop/buyhistorymessages40", [], queryBuyHistoryMessages40);

router.get(
	"/api/shop/historymessages60tariffs",
	[],
	queryGetHistoryMessages60Tariffs
);
router.post("/api/shop/buyhistorymessages60", [], queryBuyHistoryMessages60);

router.get(
	"/api/shop/historymessages80tariffs",
	[],
	queryGetHistoryMessages80Tariffs
);
router.post("/api/shop/buyhistorymessages80", [], queryBuyHistoryMessages80);

router.get(
	"/api/shop/historymessages100tariffs",
	[],
	queryGetHistoryMessages100Tariffs
);
router.post("/api/shop/buyhistorymessages100", [], queryBuyHistoryMessages100);

router.get(
	"/api/shop/historymessages150tariffs",
	[],
	queryGetHistoryMessages150Tariffs
);
router.post("/api/shop/buyhistorymessages150", [], queryBuyHistoryMessages150);

router.get(
	"/api/shop/historymessages200tariffs",
	[],
	queryGetHistoryMessages200Tariffs
);
router.post("/api/shop/buyhistorymessages200", [], queryBuyHistoryMessages200);

router.get(
	"/api/shop/historymessages300tariffs",
	[],
	queryGetHistoryMessages300Tariffs
);
router.post("/api/shop/buyhistorymessages300", [], queryBuyHistoryMessages300);

module.exports = router;
