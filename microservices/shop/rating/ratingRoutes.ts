import { queryBuyRating, queryGetRatingTariffs } from "./ratingAPI";

const express = require("express");
const router = express.Router();

// Users rout
router.get("/api/shop/ratingtariffs", [], queryGetRatingTariffs);
router.post("/api/shop/buyrating", [], queryBuyRating);

module.exports = router;
