import { IGetProfiles, IProfileShortOutput } from "./iprofile";
import {
	getProfilesShortForFavoriteUsersFromDB,
	getProfilesShortForLikesFromDB,
	getProfilesShortFromDB,
} from "./profileDB";

export async function getProfilesShort(
	QueryGetProfiles: IGetProfiles
): Promise<IProfileShortOutput[]> {
	const newProfiles: IProfileShortOutput[] = [];

	try {
		const profiles = await getProfilesShortFromDB(QueryGetProfiles);

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

		return newProfiles;
	} catch (error) {
		console.log("getProfilesShort", error);
		return newProfiles;
	}
}

export async function getProfilesShortForLikes(
	QueryGetProfiles: IGetProfiles
): Promise<IProfileShortOutput[]> {
	const newProfiles: IProfileShortOutput[] = [];

	try {
		const profiles = await getProfilesShortForLikesFromDB(QueryGetProfiles);

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

		return newProfiles;
	} catch (error) {
		console.log("getProfilesShortForLikes", error);
		return newProfiles;
	}
}

export async function getProfilesShortForFavoriteUsers(
	QueryGetProfiles: IGetProfiles
): Promise<IProfileShortOutput[]> {
	const newProfiles: IProfileShortOutput[] = [];

	try {
		const profiles = await getProfilesShortForFavoriteUsersFromDB(
			QueryGetProfiles
		);

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

		return newProfiles;
	} catch (error) {
		console.log("getProfilesShortForFavoriteUsers", error);
		return newProfiles;
	}
}
