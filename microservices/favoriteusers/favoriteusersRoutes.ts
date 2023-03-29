import { queryFavoriteUsers } from "./favoriteusersAPI";

const express = require("express");
const router = express.Router();

// Users routs
router.put("/api/favoriteuser", [], queryFavoriteUsers);

module.exports = router;
