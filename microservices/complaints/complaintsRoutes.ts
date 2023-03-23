import { queryGetComplaints } from "../complaints/complaintsAPI";

const express = require("express");
const router = express.Router();

// Users routs
router.get("/api/complaints", [], queryGetComplaints);

module.exports = router;
