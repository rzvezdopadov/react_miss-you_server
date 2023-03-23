import { IQueryGetProfile } from "../profile/iprofile";
import {
	getAdminAcctypeByIdFromDB,
	getAdminProfiles,
	getAdminStatVisitByIdFromDB,
	setAdminAcctypeByIdToDB,
	setAdminBannedByIdToDB,
} from "./adminDB";
import {
	getProfileByIdFromDB,
	getProfileCashByIdFromDB,
	getProfileRatingByIdFromDB,
	setProfileCashByIdToDB,
	setProfileRatingByIdToDB,
} from "../profile/profileDB";
import { getTimecodeNow } from "../../utils/datetime";
import { deletePhoto } from "../images/imagesUtils";
import { testToken } from "../auth/token";
import {
	ACCTYPE,
	IQueryDeleteAdminPhoto,
	IQueryGetAdminProfiles,
	IQuerySetAdminBanned,
} from "./iadmin";
import {
	answerStatus200,
	answerStatus400,
	answerStatusAccessDenied,
	answerStatusJWT,
	answerStatusQTDB,
} from "../../utils/answerstatus";

export async function queryAdminGetProfiles(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return answerStatusAccessDenied(res);

		const QueryGetAdminProfiles: IQueryGetAdminProfiles = req.query;

		const getAdminProfilesVal: IQueryGetAdminProfiles = {
			startcount: QueryGetAdminProfiles.startcount,
			amount: QueryGetAdminProfiles.amount,
			filters: QueryGetAdminProfiles.filters,
		};

		const { filters } = getAdminProfilesVal;

		if (filters) {
			const filtersParse = JSON.parse(filters as any);
			getAdminProfilesVal.filters = filtersParse;
		}

		const profiles = await getAdminProfiles(getAdminProfilesVal);

		return res.status(200).json(profiles);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryAdminGetVisit(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return answerStatusAccessDenied(res);

		let { userid } = req.body;
		userid = String(userid);

		const statVisit = await getAdminStatVisitByIdFromDB(userid);

		return res.status(200).json(statVisit);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryAdminSetAcctype(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return answerStatusAccessDenied(res);

		let { userid, acctype }: { userid: string; acctype: ACCTYPE } =
			req.body;
		userid = String(userid);

		const acctypeResult = await setAdminAcctypeByIdToDB(userid, acctype);
		if (!acctypeResult) answerStatus400(res, "Данные не были записанны!");

		return answerStatus200(res, "Успешно выполненно!");
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryAdminSetRaiting(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return answerStatusAccessDenied(res);

		let { userid, addrating }: { userid: string; addrating: number } =
			req.body;
		userid = String(userid);
		addrating = Math.floor(Number(addrating));

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

export async function queryAdminSetCash(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return answerStatusAccessDenied(res);

		let { userid, addcash }: { userid: string; addcash: number } = req.body;
		userid = String(userid);
		addcash = Math.floor(Number(addcash));

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

export async function queryAdminGetProfile(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return answerStatusAccessDenied(res);

		const QueryGetProfiles: IQueryGetProfile = req.query;
		const userid = String(QueryGetProfiles.userid);

		const profile = await getProfileByIdFromDB(userid);

		return res.status(200).json(profile);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}

export async function queryAdminSetBanned(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return answerStatusAccessDenied(res);

		let { userid, discription, minute, hour, month }: IQuerySetAdminBanned =
			req.body;
		userid = String(userid);
		discription = String(discription);
		minute = Number(minute);
		hour = Number(hour);
		month = Number(month);

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
			month * 12 * 24 * 60 * 1000 +
			hour * 24 * 60 * 1000 +
			minute * 60 * 1000;

		const answerDB = await setAdminBannedByIdToDB(userid, {
			timecode: timecodeBanned,
			whobanned: adminCandidate,
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

export async function queryAdminDeletePhoto(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode) return answerStatusJWT(res);

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return answerStatusAccessDenied(res);
		let { userid, photoPos }: IQueryDeleteAdminPhoto = req.body;
		userid = String(userid);
		photoPos = Number(photoPos);

		const photos = await deletePhoto(userid, photoPos);

		return res.status(200).json(photos);
	} catch (error) {
		return answerStatusQTDB(res, error);
	}
}
