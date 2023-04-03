import {
	getBannedUsersByIdFromDB,
	setBannedUsersByIdToDB,
} from "./bannedusersDB";

export const setBannedUsersById = async (ourId: string, userId: string) => {
	try {
		let bannedUsers = await getBannedUsersByIdFromDB(ourId);

		if (userId === "") {
			return bannedUsers;
		}

		const posBannedUser = bannedUsers.indexOf(userId);

		const commandDelete = "delete";
		const commandAdded = "added";
		let command = commandDelete;

		if (posBannedUser === -1) {
			bannedUsers.push(userId);

			command = commandAdded;
		} else {
			bannedUsers.splice(posBannedUser, 1);
		}

		await setBannedUsersByIdToDB(ourId, bannedUsers);

		bannedUsers = await getBannedUsersByIdFromDB(ourId);

		return bannedUsers;
	} catch (error) {
		console.log(error);

		return [];
	}
};
