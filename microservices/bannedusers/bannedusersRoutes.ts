import { queryBannedUsers } from "./bannedusersAPI";

const express = require("express");
const router = express.Router();

// Users routs
router.put("/api/banneduser", [], queryBannedUsers);

module.exports = router;
