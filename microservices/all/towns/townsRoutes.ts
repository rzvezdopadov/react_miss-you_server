import { queryGetTowns } from "./townsAPI";

const express = require("express");
const router = express.Router();

// Users routs
router.post("/api/towns", [], queryGetTowns);

module.exports = router;
