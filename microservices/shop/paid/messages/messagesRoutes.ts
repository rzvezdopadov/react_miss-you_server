import {
	queryBuyMessagesRead,
	queryBuyMessagesWrite,
	queryGetMessagesReadTariffs,
	queryGetMessagesWriteTariffs,
} from "./messagesAPI";

const express = require("express");
const router = express.Router();

// Users rout
router.get("/api/shop/messageswritetariffs", [], queryGetMessagesWriteTariffs);
router.post("/api/shop/buymessageswrite", [], queryBuyMessagesWrite);

router.get("/api/shop/messagesreadtariffs", [], queryGetMessagesReadTariffs);
router.post("/api/shop/buymessagesread", [], queryBuyMessagesRead);

module.exports = router;
