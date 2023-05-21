import {
	IProfileShortOutput,
	IQueryGetProfile,
} from "../../user/profile/iprofile";
import {
	getProfilesFromDB,
	getStatVisitByIdFromDB,
	setAcctypeByIdToDB,
	setBannedByIdToDB,
} from "./profileDB";
import {
	getProfileByIdFromDB,
	getProfileCashByIdFromDB,
	getProfileRatingByIdFromDB,
	setProfileCashByIdToDB,
	setProfileRatingByIdToDB,
} from "../../user/profile/profileDB";
import {
	TIMECODE_DAY,
	TIMECODE_HOUR,
	TIMECODE_MINUTE,
	TIMECODE_MONTH,
	getTimecodeNow,
} from "../../../utils/datetime";
import {
	IQueryDeleteAdminPhoto,
	IQueryGetAdminProfiles,
	IQuerySetAdminBanned,
} from "./iprofile";
import {
	answerStatus200,
	answerStatus400,
	answerStatusFailJWT,
	answerStatusQTDB,
} from "../../../utils/answerstatus";
import { ACCTYPE } from "../../role/role";
import { testToken } from "../../all/auth/token";
import { deletePhoto } from "../../all/images/imagesUtils";
import { normalizeNumber, normalizeString } from "../../../utils/normalize";
import { isCandidateType } from "../../all/auth/authUtils";

export async function queryGetProfilesShort(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		if (!(await isCandidateType(res, jwtDecode.userId, ACCTYPE.admin)))
			return;

		const QueryGetAdminProfiles: IQueryGetAdminProfiles = req.query;

		const getAdminProfilesVal: IQueryGetAdminProfiles = {
			startcount: normalizeNumber(QueryGetAdminProfiles.startcount),
			amount: normalizeNumber(QueryGetAdminProfiles.amount),
			filters: QueryGetAdminProfiles.filters,
		};

		const { filters } = getAdminProfilesVal;

		if (filters) {
			const filtersParse = JSON.parse(filters as any);
			getAdminProfilesVal.filters = filtersParse;
		}

		const profiles = await getProfilesFromDB(getAdminProfilesVal);

		const newProfiles: IProfileShortOutput[] = [];

		profiles.forEach((profile) => {
			const newProfile: IProfileShortOutput = {
				userid: profile.userid,
				timecode: profile.timecode,
				name: profile.name,
				birthday: profile.birthday,
				monthofbirth: profile.monthofbirth,
				yearofbirth: profile.yearofbirth,
				gender: profile.gender,
				photolink: profile.photolink[profile.photomain],
				interests: profile.interests,
				rating: profile.rating,
			};

			newProfiles.push(newProfile);
		});

		return res.status(200).json(profiles);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryGetVisit(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		if (!(await isCandidateType(res, jwtDecode.userId, ACCTYPE.admin)))
			return;

		let { userid } = req.body;
		userid = normalizeString(userid);

		const statVisit = await getStatVisitByIdFromDB(userid);

		return res.status(200).json(statVisit);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function querySetAcctype(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		if (!(await isCandidateType(res, jwtDecode.userId, ACCTYPE.admin)))
			return;

		let { userid, acctype }: { userid: string; acctype: ACCTYPE } =
			req.body;
		userid = normalizeString(userid);

		const acctypeResult = await setAcctypeByIdToDB(userid, acctype);
		if (!acctypeResult) answerStatus400(res, "Данные не были записанны!");

		return answerStatus200(res, "Успешно выполненно!");
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function querySetRaiting(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		if (!(await isCandidateType(res, jwtDecode.userId, ACCTYPE.admin)))
			return;

		let { userid, addrating }: { userid: string; addrating: number } =
			req.body;
		userid = normalizeString(userid);
		addrating = Math.floor(normalizeNumber(addrating));

		const diffRating = 5000;
		if (addrating < -1 * diffRating || addrating > diffRating)
			return res.status(400).json({
				message: `Нельзя назначить за один раз больше ${diffRating} баллов!`,
			});

		let rating = await getProfileRatingByIdFromDB(userid);
		rating += addrating;
		if (rating < 0) rating = 0;
		const raitingResult = await setProfileRatingByIdToDB(userid, rating);

		if (!raitingResult)
			return res.status(400).json({
				message: "Данные не были записанны!",
			});

		const profile = await getProfileByIdFromDB(userid);

		return res.status(200).json(profile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function querySetCash(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		if (!(await isCandidateType(res, jwtDecode.userId, ACCTYPE.admin)))
			return;

		let { userid, addcash }: { userid: string; addcash: number } = req.body;
		userid = normalizeString(userid);
		addcash = Math.floor(normalizeNumber(addcash));

		const diffCash = 5000;
		if (addcash < -1 * diffCash || addcash > diffCash)
			return res.status(400).json({
				message: `Нельзя назначить за один раз больше ${diffCash} MY-баллов!`,
			});

		let cash = await getProfileCashByIdFromDB(userid);
		cash += addcash;
		if (cash < 0) cash = 0;
		const cashResult = await setProfileCashByIdToDB(userid, cash);

		if (!cashResult)
			return res.status(400).json({
				message: "Данные не были записанны!",
			});

		const profile = await getProfileByIdFromDB(userid);

		return res.status(200).json(profile);
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

		if (!(await isCandidateType(res, jwtDecode.userId, ACCTYPE.admin)))
			return;

		const QueryGetProfiles: IQueryGetProfile = req.query;
		const userid = normalizeString(QueryGetProfiles.userid);

		let userIdNew = userid;

		if (userIdNew === "0") {
			userIdNew = jwtDecode.userId;
		}

		const profile = await getProfileByIdFromDB(userIdNew);

		return res.status(200).json(profile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function querySetBanned(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		if (!(await isCandidateType(res, jwtDecode.userId, ACCTYPE.admin)))
			return;

		let { userid, discription, minute, hour, month }: IQuerySetAdminBanned =
			req.body;
		userid = normalizeString(userid);
		discription = normalizeString(discription);
		minute = normalizeNumber(minute);
		hour = normalizeNumber(hour);
		month = normalizeNumber(month);

		if (jwtDecode.userId === userid)
			return res.status(400).json({
				message: "Нельзя забанить самого себя!",
			});

		const sumTime = minute + hour + month;

		if (sumTime && !discription)
			return res.status(400).json({
				message: `Не указанно за что забанить пользователя!`,
			});

		const timecodeBanned =
			getTimecodeNow() +
			month * TIMECODE_MONTH +
			hour * TIMECODE_HOUR +
			minute * TIMECODE_MINUTE;

		const answerDB = await setBannedByIdToDB(userid, {
			timecode: timecodeBanned,
			whobanned: ACCTYPE.admin,
			discription: discription,
		});

		if (!answerDB)
			return res.status(400).json({
				message: "Данные не были записанны!",
			});

		return res.status(200).json({
			message: "Успешно выполненно!",
		});
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryDeletePhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = normalizeString(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusFailJWT(res);

		if (!(await isCandidateType(res, jwtDecode.userId, ACCTYPE.admin)))
			return;

		let { userid, photoPos }: IQueryDeleteAdminPhoto = req.body;
		userid = normalizeString(userid);
		photoPos = normalizeNumber(photoPos);

		const photos = await deletePhoto(userid, photoPos);

		return res.status(200).json(photos);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
