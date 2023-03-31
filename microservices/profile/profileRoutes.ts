import {
	queryDeleteAcc,
	queryDeleteAccCancel,
	queryGetProfile,
	queryGetProfilesForFavoriteUsers,
	queryGetProfilesForLikes,
	queryGetProfilesShort,
	querySetProfile,
} from "./profileAPI";

const express = require("express");
const router = express.Router();

// Users routs
router.get("/api/profilesforlikes", [], queryGetProfilesForLikes);
router.get(
	"/api/profilesforfavoriteusers",
	[],
	queryGetProfilesForFavoriteUsers
);

router.put("/api/profile", [], querySetProfile);
router.get("/api/profile", [], queryGetProfile);
router.get("/api/profilesshort", [], queryGetProfilesShort);

router.delete("/api/deleteacc", [], queryDeleteAcc);
router.put("/api/deleteacc", [], queryDeleteAccCancel);

module.exports = router;
