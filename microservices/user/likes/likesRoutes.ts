import { querySetLike } from "./likesAPI";

const express = require("express");
const router = express.Router();

// Users routs
router.put("/api/like", [], querySetLike);

module.exports = router;
