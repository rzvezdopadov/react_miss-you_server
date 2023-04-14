import {
	IGetProfiles,
	IProfile,
	IQueryGetProfile,
	IQueryGetProfiles,
} from "./iprofile";
import { getSignZodiac } from "../../../utils/signzodiac";
import {
	getProfileByIdFromDB,
	getProfileDeleteAccByIdFromDB,
	setProfileByIdToDB,
	setProfileDeleteAccByIdToDB,
} from "./profileDB";
import { isBannedUser } from "../../../utils/banned";
import {
	getProfilesShort,
	getProfilesShortForFavoriteUsers,
	getProfilesShortForLikes,
} from "./profileUtils";
import {
	answerStatus400,
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../utils/answerstatus";
import { TIMECODE_MONTH, getTimecodeNow } from "../../../utils/datetime";
import { testToken } from "../../all/auth/token";
import { getPaidByIdFromDB } from "../shop/paid/paidDB";
import { testPaidOnOverflow } from "../shop/paid/paidUtils";
import { normalizeString } from "../../../utils/normalize";

export async function querySetProfile(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const { profile }: { profile: IProfile } = req.body;

		profile.signzodiac = getSignZodiac(
			profile.birthday,
			profile.monthofbirth
		);

		const userIdPaid = await getPaidByIdFromDB(jwtDecode.userId);
		const timecode = getTimecodeNow();

		if (
			userIdPaid.interests30.timecode > timecode &&
			profile.interests.length > 30
		) {
			profile.interests.splice(30);
		} else if (
			userIdPaid.interests20.timecode > timecode &&
			profile.interests.length > 20
		) {
			profile.interests.splice(20);
		} else if (profile.interests.length > 10) {
			profile.interests.splice(10);
		}

		const newProfile = await setProfileByIdToDB(jwtDecode.userId, profile);

		if (!newProfile) return answerStatus400(res, "Ошибка QTDB!");

		return res.status(200).json(newProfile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetProfile(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const isBanned = await isBannedUser(jwtDecode.userId);

		if (isBanned) return answerStatusFailJWT(res);

		const QueryGetProfile: IQueryGetProfile = req.query;
		const userid = normalizeString(QueryGetProfile.userid);

		let userIdNew = userid;

		if (userIdNew === "0") {
			userIdNew = jwtDecode.userId;
		}

		const profile = await getProfileByIdFromDB(userIdNew);

		if (!profile) return answerStatus400(res, "Ошибка QTDB!");

		if (userid !== "0") {
			const posId = profile.likes.indexOf(jwtDecode.userId);

			if (posId === -1) {
				profile.likes = [];
			} else {
				profile.likes = [jwtDecode.userId];
			}

			profile.cash = 0;
			profile.favoriteusers = [];

			let bannedusers = [];
			if (profile.bannedusers.includes(jwtDecode.userId))
				bannedusers.push(jwtDecode.userId);
			profile.bannedusers = bannedusers;
			profile.achivments = [];
			profile.presents = [];
			profile.paid = undefined;
			profile.deleteacc = 0;
		} else {
			profile.paid = testPaidOnOverflow(profile.paid);
		}

		return res.status(200).json(profile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

function profileQueryModifi(
	QueryGetProfiles: IQueryGetProfiles,
	userId: string
): IGetProfiles {
	const getProfilesVal: IGetProfiles = {
		userid: QueryGetProfiles.userid,
		startcount: QueryGetProfiles.startcount,
		amount: QueryGetProfiles.amount,
		filters: QueryGetProfiles.filters,
		users: [],
	};

	const { filters, users } = QueryGetProfiles;

	if (filters) {
		const filtersParse = JSON.parse(filters as any);
		getProfilesVal.filters = filtersParse;
	}

	if (users) {
		const usersParse = JSON.parse(users);
		getProfilesVal.users = usersParse;
	}

	getProfilesVal.userid = userId;

	return getProfilesVal;
}

export async function queryGetProfilesShort(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const QueryGetProfiles: IQueryGetProfiles = req.query;

		const getProfilesVal = profileQueryModifi(
			QueryGetProfiles,
			jwtDecode.userId
		);

		const profiles = await getProfilesShort(getProfilesVal);

		return res.status(200).json(profiles);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetProfilesForLikes(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const QueryGetProfiles: IQueryGetProfiles = req.query;

		const getProfilesVal = profileQueryModifi(
			QueryGetProfiles,
			jwtDecode.userId
		);

		const profiles = await getProfilesShortForLikes(getProfilesVal);

		return res.status(200).json(profiles);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetProfilesForFavoriteUsers(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		const QueryGetProfiles: IQueryGetProfiles = req.query;

		const getProfilesVal = profileQueryModifi(
			QueryGetProfiles,
			jwtDecode.userId
		);

		const profiles = await getProfilesShortForFavoriteUsers(getProfilesVal);

		return res.status(200).json(profiles);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryDeleteAcc(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		let deleteacc = await getProfileDeleteAccByIdFromDB(jwtDecode.userId);

		deleteacc = getTimecodeNow() + TIMECODE_MONTH;

		await setProfileDeleteAccByIdToDB(jwtDecode.userId, deleteacc);

		const profile = await getProfileByIdFromDB(jwtDecode.userId);

		return res.status(200).json(profile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryDeleteAccCancel(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		await setProfileDeleteAccByIdToDB(jwtDecode.userId, 0);

		const profile = await getProfileByIdFromDB(jwtDecode.userId);

		return res.status(200).json(profile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
