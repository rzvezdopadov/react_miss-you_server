import {
	getFavoriteUsersByIdFromDB,
	setFavoriteUsersByIdToDB,
} from "./favoriteusersDB";

export const setFavoriteUsersById = async (ourId: string, userId: string) => {
	try {
		let favoriteUsers = await getFavoriteUsersByIdFromDB(ourId);

		if (userId === "") {
			return favoriteUsers;
		}

		const posFavoriteUser = favoriteUsers.indexOf(userId);

		const commandDelete = "delete";
		const commandAdded = "added";
		let command = commandDelete;

		if (posFavoriteUser === -1) {
			favoriteUsers.push(userId);

			command = commandAdded;
		} else {
			favoriteUsers.splice(posFavoriteUser, 1);
		}

		await setFavoriteUsersByIdToDB(ourId, favoriteUsers);

		favoriteUsers = await getFavoriteUsersByIdFromDB(ourId);

		return favoriteUsers;
	} catch (error) {
		console.log(error);

		return [];
	}
};
