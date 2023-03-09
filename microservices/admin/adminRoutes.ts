import {
	queryAdminDeletePhoto,
	queryAdminGetProfile,
	queryAdminGetProfiles,
	queryAdminGetVisit,
	queryAdminSetAcctype,
	queryAdminSetBanned,
	queryAdminSetCash,
	queryAdminSetRaiting,
} from "./adminAPI";

const express = require("express");
const router = express.Router();

// Admins routs
router.get("/api/admin/profiles", [], queryAdminGetProfiles);
router.get("/api/admin/profile", [], queryAdminGetProfile);

router.get("/api/admin/visit", [], queryAdminGetVisit);

router.put("/api/admin/acctype", [], queryAdminSetAcctype);

router.put("/api/admin/rating", [], queryAdminSetRaiting);

router.put("/api/admin/cash", [], queryAdminSetCash);

router.put("/api/admin/banned", [], queryAdminSetBanned);

router.delete("/api/admin/photo", [], queryAdminDeletePhoto);

module.exports = router;
