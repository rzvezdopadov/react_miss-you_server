import {
	queryBuyFiltersFavoriteUsers,
	queryBuyFiltersVapors,
	queryBuyLongFiltersFavoriteUsers,
	queryBuyLongFilters,
	queryBuyLongFiltersVapors,
	queryGetFiltersFavoriteUsersTariffs,
	queryGetFiltersVaporsTariffs,
	queryGetLongFiltersFavoriteUsersTariffs,
	queryGetLongFiltersTariffs,
	queryGetLongFiltersVaporsTariffs,
} from "./filtersAPI";

const express = require("express");
const router = express.Router();

// Users rout
router.get("/api/shop/longfilterstariffs", [], queryGetLongFiltersTariffs);
router.post("/api/shop/buylongfilters", [], queryBuyLongFilters);

router.get("/api/shop/filtersvaporstariffs", [], queryGetFiltersVaporsTariffs);
router.post("/api/shop/buyfiltersvapors", [], queryBuyFiltersVapors);

router.get(
	"/api/shop/longfiltersvaporstariffs",
	[],
	queryGetLongFiltersVaporsTariffs
);
router.post("/api/shop/buylongfiltersvapors", [], queryBuyLongFiltersVapors);

router.get(
	"/api/shop/filtersfavoriteuserstariffs",
	[],
	queryGetFiltersFavoriteUsersTariffs
);
router.post(
	"/api/shop/buyfiltersfavoriteusers",
	[],
	queryBuyFiltersFavoriteUsers
);

router.get(
	"/api/shop/longfiltersfavoriteuserstariffs",
	[],
	queryGetLongFiltersFavoriteUsersTariffs
);
router.post(
	"/api/shop/buylongfiltersfavoriteusers",
	[],
	queryBuyLongFiltersFavoriteUsers
);

module.exports = router;
