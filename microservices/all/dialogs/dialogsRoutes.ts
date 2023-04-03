import { queryGetDialog, queryGetDialogs } from "./dialogsAPI";

const express = require("express");
const router = express.Router();

// Users routs
router.get("/api/dialog", [], queryGetDialog);
router.get("/api/dialogs", [], queryGetDialogs);

module.exports = router;
