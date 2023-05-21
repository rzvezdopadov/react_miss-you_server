import {
	queryDeletePhoto,
	queryGetProfile,
	queryGetProfilesShort,
	queryGetVisit,
	querySetAcctype,
	querySetBanned,
	querySetCash,
	querySetRaiting,
} from "./profileAPI";

const express = require("express");
const router = express.Router();

// Admins routs
router.get("/api/admin/profiles", [], queryGetProfilesShort);
router.get("/api/admin/profile", [], queryGetProfile);

router.get("/api/admin/visit", [], queryGetVisit);

router.put("/api/admin/acctype", [], querySetAcctype);

router.put("/api/admin/rating", [], querySetRaiting);

router.put("/api/admin/cash", [], querySetCash);

router.put("/api/admin/banned", [], querySetBanned);

router.delete("/api/admin/photo", [], queryDeletePhoto);

module.exports = router;
