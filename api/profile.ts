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
	setProfileByIdToDB,
} from "../query/profile";

export async function querySetProfile(req, res) {
	try {
		const { profile } = req.body;
		profile as IProfile;

		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		profile.signzodiac = getSignZodiac(
			profile.birthday,
			profile.monthofbirth
		);

		const newProfile = await setProfileByIdToDB(jwtDecode.userId, profile);

		return res.status(200).json(newProfile);
	} catch (e) {
		res.status(500).json({
			message: "Ошибка QTDB!",
		});
	}
}

export async function querySetProfileShort(req, res) {
	try {
		return res.status(200).json([]);
	} catch (e) {
		res.status(500).json({
			message: "Токен не валидный!",
		});
	}
}

export async function queryGetProfile(req, res) {
	try {
		const QueryGetProfiles: IQueryGetProfile = req.query;
		const id = Number(QueryGetProfiles.id);

		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		let idNew = id;

		if (idNew == 0) {
			idNew = jwtDecode.userId;
		}

		const profile = await getProfileByIdFromDB(idNew);

		if (id != 0) {
			const posId = profile.likes.indexOf(jwtDecode.userId);

			if (posId === -1) {
				profile.likes = [];
			} else {
				profile.likes = [jwtDecode.userId];
			}
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
		const QueryGetProfiles: IQueryGetProfiles = req.query;

		let { jwt } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const getProfilesVal: IGetProfiles = {
			jwt: jwt,
			id: QueryGetProfiles.id,
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
			const usersParse: any = users.split(",");
			getProfilesVal.users = usersParse;
		}

		getProfilesVal.id = jwtDecode.userId;

		const profiles = await getProfiles(getProfilesVal);

		return res.status(200).json(profiles);
	} catch (e) {
		res.status(500).json({
			message: "Токен не валидный!",
		});
	}
}
