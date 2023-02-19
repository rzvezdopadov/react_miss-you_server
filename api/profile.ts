import {
	IGetProfiles,
	IProfile,
	IQueryGetProfile,
	IQueryGetProfiles,
} from "../interfaces/iprofiles";
import { getSignZodiac } from "../utils/profile";
import { testToken } from "../utils/token";
import {
	getProfileByIdFromDB,
	getProfiles,
	getProfilesForLikes,
	setProfileByIdToDB,
} from "../query/profile";

export async function querySetProfile(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const { profile } = req.body;
		profile as IProfile;

		profile.signzodiac = getSignZodiac(
			profile.birthday,
			profile.monthofbirth
		);

		const newProfile = await setProfileByIdToDB(jwtDecode.userId, profile);

		if (!newProfile)
			return res.status(400).json({
				message: "Ошибка QTDB!",
			});

		return res.status(200).json(newProfile);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}

export async function queryGetProfile(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const QueryGetProfile: IQueryGetProfile = req.query;
		const userid = String(QueryGetProfile.userid);

		let userIdNew = userid;

		if (userIdNew === "0") {
			userIdNew = jwtDecode.userId;
		}

		const profile = await getProfileByIdFromDB(userIdNew);

		if (!profile)
			res.status(400).json({
				message: "Ошибка QTDB!",
			});

		if (userid !== "0") {
			const posId = profile.likes.indexOf(jwtDecode.userId);

			if (posId === -1) {
				profile.likes = [];
			} else {
				profile.likes = [jwtDecode.userId];
			}

			profile.cash = 0;
		}

		return res.status(200).json(profile);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}

export async function queryGetProfiles(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const QueryGetProfiles: IQueryGetProfiles = req.query;

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

		getProfilesVal.userid = jwtDecode.userId;

		const profiles = await getProfiles(getProfilesVal);

		return res.status(200).json(profiles);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}

export async function queryGetProfilesForLikes(req, res) {
	try {
		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const QueryGetProfiles: IQueryGetProfiles = req.query;

		const getProfilesVal: IGetProfiles = {
			userid: QueryGetProfiles.userid,
			startcount: QueryGetProfiles.startcount,
			amount: QueryGetProfiles.amount,
			filters: QueryGetProfiles.filters,
			users: [],
		};

		getProfilesVal.userid = jwtDecode.userId;

		const profiles = await getProfilesForLikes(getProfilesVal);

		return res.status(200).json(profiles);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}
