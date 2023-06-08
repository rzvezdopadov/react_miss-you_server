import { queryGetTransactions } from "./transactionsAPI";

const express = require("express");
const router = express.Router();

// Users routs
router.get("/api/shop/transactions", [], queryGetTransactions);

module.exports = router;
