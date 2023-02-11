import {
	ACCTYPE,
	IAdminFilterUsers,
	IQueryGetAdminProfiles,
} from "../interfaces/iadmin";
import {
	getAdminAcctypeByIdFromDB,
	getAdminProfiles,
	getAdminStatVisitByIdFromDB,
	setAdminAcctypeByIdToDB,
} from "../query/admin";
import {
	getProfileRatingByIdFromDB,
	setProfileRatingByIdToDB,
} from "../query/profile";
import { testToken } from "../utils/token";

export async function queryAdminGetProfiles(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return res.status(400).json({
				message:
					"У вас нет прав доступа на выполнение данной операции!",
			});

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
		console.log(error);
		return res.status(500).json({
			message: "Что-то пошло не так при получении пользователей!",
		});
	}
}

export async function queryAdminGetVisit(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return res.status(400).json({
				message:
					"У вас нет прав доступа на выполнение данной операции!",
			});

		let { userid } = req.body;
		userid = String(userid);

		const statVisit = await getAdminStatVisitByIdFromDB(userid);

		return res.status(200).json(statVisit);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Что-то пошло не так при получении статистики посещений!",
		});
	}
}

export async function queryAdminSetAcctype(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return res.status(400).json({
				message:
					"У вас нет прав доступа на выполнение данной операции!",
			});

		let { userid, acctype }: { userid: string; acctype: ACCTYPE } =
			req.body;
		userid = String(userid);

		const acctypeResult = await setAdminAcctypeByIdToDB(userid, acctype);
		if (!acctypeResult)
			return res.status(400).json({
				message: "Данные не были записанны!",
			});

		return res.status(200).json({ message: "Успешно выполненно!" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Что-то пошло не так при переназначении типов!",
		});
	}
}

export async function queryAdminSetRaiting(req, res) {
	try {
		let { jwt }: { jwt: string } = req.cookies;
		jwt = String(jwt);

		const jwtDecode = await testToken(jwt);

		if (!jwtDecode)
			return res.status(400).json({
				message: "Токен не валидный!",
			});

		const adminCandidate = await getAdminAcctypeByIdFromDB(
			jwtDecode.userId
		);

		if (adminCandidate !== ACCTYPE.admin)
			return res.status(400).json({
				message:
					"У вас нет прав доступа на выполнение данной операции!",
			});

		let { userid, addrating }: { userid: string; addrating: number } =
			req.body;
		userid = String(userid);
		addrating = Number(addrating);

		let rating = await getProfileRatingByIdFromDB(userid);
		rating += addrating;
		const raitingResult = await setProfileRatingByIdToDB(userid, rating);

		if (!raitingResult)
			return res.status(400).json({
				message: "Данные не были записанны!",
			});

		return res.status(200).json({ message: "Успешно выполненно!" });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Что-то пошло не так при корректировке рейтинга!",
		});
	}
}
