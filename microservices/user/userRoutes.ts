import { queryGetComplaints } from "../complaints/complaintsAPI";
import { queryGetDialog, queryGetDialogs } from "../dialogs/dialogsAPI";
import {
	queryCheckPhoto,
	queryDeletePhoto,
	queryLoadPhoto,
} from "../images/imagesAPI";
import { querySetLike } from "../profile/likes/likesAPI";
import {
	queryGetProfile,
	queryGetProfiles,
	queryGetProfilesForLikes,
	querySetProfile,
} from "../profile/profile/profileAPI";
import {
	queryAddStickerpack,
	queryBuyRating,
	queryDeleteStickerpack,
	queryGetRatingTariffs,
} from "../shop/shopAPI";
import { queryGetAllStickerpacks } from "../shop/stickerpacks/stickerpacksAPI";

const express = require("express");
const router = express.Router();

// Users routs
router.get("/api/profilesforlikes", [], queryGetProfilesForLikes);

router.put("/api/profile", [], querySetProfile);
router.get("/api/profile", [], queryGetProfile);
router.get("/api/profiles", [], queryGetProfiles);

router.put("/api/like", [], querySetLike);

router.get("/api/dialog", [], queryGetDialog);
router.get("/api/dialogs", [], queryGetDialogs);

router.post("/api/photo", [], queryLoadPhoto);
router.put("/api/photo", [], queryCheckPhoto);
router.delete("/api/photo", [], queryDeletePhoto);

router.get("/api/stickerpacks", [], queryGetAllStickerpacks);

router.get("/api/ratingtariffs", [], queryGetRatingTariffs);

router.post("/api/buyrating", [], queryBuyRating);

router.post("/api/stickerpack", [], queryAddStickerpack);

router.delete("/api/stickerpack", [], queryDeleteStickerpack);

router.get("/api/complaints", [], queryGetComplaints);

module.exports = router;
